import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Adres email użytkownika' })
  @IsEmail({}, { message: 'Email musi być poprawnym adresem email' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Hasło użytkownika' })
  @IsString({ message: 'Hasło musi być tekstem' })
  password: string;
}
