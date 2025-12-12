import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Adres email użytkownika' })
  @IsEmail({}, { message: 'Email musi być poprawnym adresem email' })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Hasło musi zawierać minimum 8 znaków, w tym co najmniej jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny',
  })
  @IsString({ message: 'Hasło musi być tekstem' })
  @IsStrongPassword()
  password: string;
}
