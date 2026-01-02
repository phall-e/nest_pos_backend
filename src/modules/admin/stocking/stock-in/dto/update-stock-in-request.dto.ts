import { PartialType } from '@nestjs/swagger';
import { CreateStockInItemRequestDto } from './create-stock-in-item-request.dto';

export class UpdateStockInRequestDto extends PartialType(CreateStockInItemRequestDto) {}
