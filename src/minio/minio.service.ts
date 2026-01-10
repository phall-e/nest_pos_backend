import { Injectable } from '@nestjs/common';
import * as Minio from "minio";
import { MinioProvider } from './minio.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService{
    private client: Minio.Client;
    
    constructor(
        private minioProvider: MinioProvider,
        private configService: ConfigService,
    ){
        this.client = this.minioProvider.createClient();
        
    }

    private async ensureBucket(bucketName: string): Promise<void> {
        const exists = await this.client.bucketExists(bucketName);

        if (!exists) {
            await this.client.makeBucket(bucketName, 'us-east-1');

            // (Optional but recommended)
            console.log(`MinIO bucket "${bucketName}" created`);
        }
    }

    async uploadFile(bucketName: string, filePath: string, file: Buffer, mimeType?: string) {
        try {
            await this.ensureBucket(bucketName);

            this.client.putObject(bucketName, filePath, file, file.length, {
                'Content-Type': mimeType ?? 'application/octet-stream',
            });
            return filePath;
        } catch (error) {
            throw error;
        }
    }

    async generateTemLink(
        bucketName: string,
        objectName: string,
        expiry = 3600,
    ): Promise<string> {
        try {
            return await this.client.presignedUrl(
                "GET",
                bucketName,
                objectName,
                expiry,
            );
        } catch (error) {
            console.log('Error generating temporary link:', error);
            return null;
        }
    }

    private getMimeType(filePath: string): string {
        const extension = filePath.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }

    async getPreviewUrl(filePath: string): Promise<string> {
        try {
            const bucketName = 'images';
            const expiry = 60 * 60;
            
            const headers = {
                'response-content-type': this.getMimeType(filePath),
                'response-content-disposition': 'inline',
            }

            const url = await this.client.presignedGetObject(
                bucketName,
                filePath,
                expiry,
                headers,
            );

            if (this.configService.get('MINIO_DNS')) {
                return url.replace(
                    'http://' + 
                        this.configService.get('MINIO_ENDPOINT') +
                        ':' + 
                        this.configService.get('MINIO_PORT'),
                    this.configService.get('MINIO_DNS')
                );
            }
            return url;
        } catch (error) {
            throw new Error(`Failed to generate preview URL: ${error.message}`);
        }
    }

    async getImageLink(filePath: string) {
        return this.generateTemLink('images', filePath);
    }

    async uploadImage(filePath: string, file: Buffer) {
        console.log('Upload image', filePath);
        return this.uploadFile('images', filePath, file);
    }

    async uploadDocument(filePath: string, file: Buffer) {
        return this.uploadFile('documents', filePath, file);
    }

    async deleteFile(bucket: string, objectName: string): Promise<void> {
        await this.client.removeObject(bucket, objectName)
    }
   
}
