import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const { combine, timestamp, printf, errors, json } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const transportError = new winston.transports.DailyRotateFile({
  filename: './logs/server-error.log-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '1d',
  format: combine(timestamp(), json(), winston.format.prettyPrint(), errors()),
  level: 'error',
});

const transportCombined = new winston.transports.DailyRotateFile({
  filename: './logs/server-combined.log-%DATE%.log',
  format: combine(
    timestamp(),
    json(),
    winston.format.prettyPrint(),
    errors({ stack: true }),
  ),
  maxSize: '20m',
  maxFiles: '1d',
});

const transportWarn = new winston.transports.DailyRotateFile({
  filename: './logs/server-warn.log-%DATE%.log',
  format: combine(
    timestamp(),
    json(),
    winston.format.prettyPrint(),
    errors({ stack: true }),
  ),
  maxSize: '20m',
  maxFiles: '1d',
  level: 'warn',
});

@Module({
  imports: [
    OrderModule,
    BookModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        };
      },
    }),
    WinstonModule.forRoot({
      format: combine(
        winston.format.colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(errors({ stack: true })),
        }),
        transportError,
        transportWarn,
        transportCombined,
      ],
    }),
  ],
  controllers: [AppController, OrderController, UserController],
  providers: [
    AppService,
    OrderService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
