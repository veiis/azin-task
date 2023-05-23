import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class AddMoneyDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    amount: number
}