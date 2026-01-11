import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CancelPurchaseRequestRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    reason: string;
}