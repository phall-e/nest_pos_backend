import { IsObject } from "class-validator";

export class CustomerAttachment {
    @IsObject()
    fileName: string;
}