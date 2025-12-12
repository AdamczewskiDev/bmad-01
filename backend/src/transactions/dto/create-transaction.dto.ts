import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE', description: 'Typ transakcji' })
  @IsEnum(['INCOME', 'EXPENSE'])
  type: 'INCOME' | 'EXPENSE';

  @ApiProperty({ example: 100.50, description: 'Kwota transakcji', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['PLN', 'EUR', 'USD'], example: 'PLN', description: 'Waluta transakcji' })
  @IsEnum(['PLN', 'EUR', 'USD'])
  currency: 'PLN' | 'EUR' | 'USD';

  @ApiProperty({ example: 'uuid-wallet-id', description: 'ID portfela' })
  @IsString()
  walletId: string;

  @ApiProperty({ example: 'uuid-category-id', description: 'ID kategorii (opcjonalne)', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'Zakupy w sklepie', description: 'Notatka do transakcji (opcjonalne)', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: '2025-12-12T10:00:00Z', description: 'Data transakcji (opcjonalne, domyślnie teraz)', required: false })
  @IsOptional()
  @IsDateString()
  bookedAt?: string;
}
