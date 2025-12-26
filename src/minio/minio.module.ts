import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { MinioProvider } from './minio.provider';

@Module({
  providers: [MinioService, MinioProvider],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
