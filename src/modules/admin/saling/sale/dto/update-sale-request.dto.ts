import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSaleRequestDto } from './create-sale-request.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSaleRequestDto extends PartialType(CreateSaleRequestDto) {
    @ApiProperty()
    @IsNotEmpty()
    code: string;
}
