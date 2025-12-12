import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Token resetu hasła',
  })
  @IsUUID('4', { message: 'Token musi być poprawnym UUID' })
  token: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'Nowe hasło (musi spełniać wymagania silnego hasła)',
  })
  @IsString({ message: 'Hasło musi być tekstem' })
  @IsStrongPassword()
  newPassword: string;
}

