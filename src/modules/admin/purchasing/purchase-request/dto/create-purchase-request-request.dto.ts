import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreatePurchaseRequestItemRequestDto } from "./create-purchase-request-item-request.dto";
import { Type } from "class-transformer";
import { PurchaseRequestAttachment } from "./attachement.dto";

export class CreatePurchaseRequestRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    requestDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments?: PurchaseRequestAttachment[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalQuantity: number;

    createdById: number;

    @ApiProperty({ type: [CreatePurchaseRequestItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseRequestItemRequestDto)
    @ArrayMinSize(1)
    items: CreatePurchaseRequestItemRequestDto[];


    
}
