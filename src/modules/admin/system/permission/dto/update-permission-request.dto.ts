import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionRequestDto } from './create-permission-request.dto';

export class UpdatePermissionRequestDto extends PartialType(CreatePermissionRequestDto) {}
