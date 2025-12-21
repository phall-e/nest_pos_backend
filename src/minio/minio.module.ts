import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { MinioProvider } from './minio.provider';

@Module({
  providers: [MinioService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
