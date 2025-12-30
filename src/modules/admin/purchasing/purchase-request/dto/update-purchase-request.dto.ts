import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePurchaseRequestRequestDto } from './create-purchase-request-request.dto';
import { IsOptional } from 'class-validator';

export class UpdatePurchaseRequestRequestDto extends CreatePurchaseRequestRequestDto {
    @ApiProperty()
    @IsOptional()
    id: number;
}
