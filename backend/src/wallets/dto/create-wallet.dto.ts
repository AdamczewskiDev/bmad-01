import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ example: 'Portfel Domowy', description: 'Nazwa portfela' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['PLN', 'EUR', 'USD'], example: 'PLN', description: 'Waluta bazowa portfela' })
  @IsEnum(['PLN', 'EUR', 'USD'])
  baseCurrency: 'PLN' | 'EUR' | 'USD';

  @ApiProperty({ example: 5000, description: 'Cel oszczędnościowy (opcjonalne)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  goalAmount?: number;

  @ApiProperty({ example: 3000, description: 'Limit wydatków (opcjonalne)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limitAmount?: number;
}
