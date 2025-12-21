import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MinioModule } from './minio/minio.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    MinioModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
