import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../entities';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Jedzenie', description: 'Nazwa kategorii' })
  @IsString()
  name: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE, description: 'Typ transakcji' })
  @IsEnum(TransactionType)
  type: TransactionType;
}
