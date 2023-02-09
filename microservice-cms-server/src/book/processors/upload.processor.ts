import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueActive,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Job } from 'bull';
import { BookService } from '../book.service';
import { firstValueFrom } from 'rxjs';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { normalize, resolve } from 'path';
@Processor('file-upload-queue')
export class UploadProcessor {
  private client: ClientProxy;
  private readonly logger = new Logger();
  constructor(private readonly bookService: BookService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  @Process('csvfilejob')
  async processFile(job: Job) {
    const filePath = process.cwd() + '/' + job.data.file.path;
    let csvResults;
    try {
      const correctedPath = normalize(resolve(filePath));
      const csvFile = await readFileSync(correctedPath, 'utf8');

      csvResults = parse(csvFile, {
        header: true,
        complete: (csvData) => csvData.data,
        skipEmptyLines: true,
      }).data;
    } catch (e) {
      throw new InternalServerErrorException(
        'Server has some internal error while processing the file',
      );
    }

    await firstValueFrom(
      this.client.send<string, any>('/book/upload', csvResults),
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} ...`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} ...`);
  }
}
