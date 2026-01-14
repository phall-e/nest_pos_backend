import { PartialType } from '@nestjs/swagger';
import { CreateCustomerTypeRequestDto } from './create-customer-type-request.dto';

export class UpdateCustomerTypeRequestDto extends PartialType(CreateCustomerTypeRequestDto) {}
