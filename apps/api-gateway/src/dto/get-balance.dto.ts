import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class GetBalanceDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId: number
}