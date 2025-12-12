import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adres email użytkownika',
  })
  @IsEmail({}, { message: 'Email musi być poprawnym adresem email' })
  email: string;
}

