import { ApiProperty } from "@nestjs/swagger";

export class UploadResponseDto {
    @ApiProperty({ 
        example: 'contract.png' 
    })
    fileName: string;

    @ApiProperty({
        example: 'documents/23456765432345-contract.png',
    })
    objectName: string;

    @ApiProperty({
        example: 'https://minio-presigned-url',
    })
    url: string;
}