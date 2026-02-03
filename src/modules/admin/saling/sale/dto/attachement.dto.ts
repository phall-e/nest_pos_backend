import { IsObject } from "class-validator";

export class SaleAttachment {
    @IsObject()
    fileName: string;
}