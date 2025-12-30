import { BadRequestException } from "@nestjs/common";
import { ObjectLiteral } from "typeorm";

export const handleTransactionCodeGeneration = async <T extends ObjectLiteral>(
    repository: T, 
    prefix: string, 
    digits = 7
): Promise<string>  => {
    try {
        const count = await repository.count();
        const nextNumber = count + 1;
        const date = new Date();
        const currentYear = date.getFullYear();
        const code =  `${prefix}${currentYear}-${String(nextNumber).padStart(digits, '0')}`;
        return code;
    } catch (error) {
        throw error;
    }

}