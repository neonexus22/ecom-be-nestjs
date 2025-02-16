/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Please provide a valid product name.' })
  name: string;

  @IsNumber()
  @Min(0)
  @Max(10000)
  price: number;
}
