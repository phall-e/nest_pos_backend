import { PartialType } from '@nestjs/swagger';
import { CreateStockTransferRequestDto } from './create-stock-transfer-request.dto';

export class UpdateStockTransferRequestDto extends PartialType(CreateStockTransferRequestDto) {}
