import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit{
    private client: Client;
    private bucket = process.env.MINIO_BUCKET;

    onModuleInit() {
        this.client = new Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: Number(process.env.MINIO_PORT),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ROOT_USER,
            secretKey: process.env.MINIO_ROOT_PASSWORD,
        });

        this.ensureBucket();
    }

    private async ensureBucket() {
        const exists = await this.client.bucketExists(this.bucket);
        if (!exists) {
            await this.client.makeBucket(this.bucket);
        }
    }

    public async upload(
        file: Express.Multer.File,
        folder: string,
    ): Promise<string> {
        const objectName = `${folder}/${Date.now()}-${file.originalname}`;

        await this.client.putObject(
            this.bucket,
            objectName,
            file.buffer,
            file.size,
            {
                'Content-Type': file.mimetype,
            },
        );

        return objectName;
    }

    public async getPresignedUrl(objectName: string) {
        return this.client.presignedGetObject(this.bucket, objectName);
    }
   
}
