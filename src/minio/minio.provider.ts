import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class MinioProvider {
    constructor(private configService: ConfigService){}

    createClient(): Minio.Client {
        console.log('endpoint ==>', this.configService.get('MINIO_ENDPOINT'));
        return new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
            port: parseInt(this.configService.get<string>('MINIO_PORT')),
            useSSL: this.configService.get<boolean>('MINIO_USE_SSL') || false,
            accessKey: this.configService.get<string>('MINIO_ROOT_USER'),
            secretKey: this.configService.get<string>('MINIO_ROOT_PASSWORD'),
        });
    }
}