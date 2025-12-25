import { PartialType } from '@nestjs/swagger';
import { CreateSupplierRequestDto } from './create-supplier-request.dto';

export class UpdateSupplierRequestDto extends PartialType(CreateSupplierRequestDto) {}
