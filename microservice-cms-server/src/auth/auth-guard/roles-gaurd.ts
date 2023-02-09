import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filters/exception.filter';
import { Role } from 'src/user/dto/user-role.dot';

@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(private refelector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.refelector.getAllAndOverride<Role[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (requiredRole !== user.userData.role) {
      throw new HttpException(
        `You don't have permission to access`,
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
