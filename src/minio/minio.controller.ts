import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Upload file')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
    path: 'admin/minio',
    version: '1',
})
export class MinioController {
    constructor(private minioSerivce: MinioService){}

    @Post('upload')
    @ApiOperation({ 
        summary: 'Upload file to MinIO',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
        type: UploadResponseDto,
    })
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_, file, cb) => {
            if (!file.mimetype.match(/(pdf|png|jpg|jpeg)$/)) {
                return cb(new Error('Invalid file type'), false);
            }
            cb(null, true);
        },
    }))
    public async uploadFile(@UploadedFile() file: Express.Multer.File){
        const objectName = await this.minioSerivce.upload(file, 'documents');

        return {
            fileName: file.originalname,
            objectName,
            url: await this.minioSerivce.getPresignedUrl(objectName),
        };
    }
}
