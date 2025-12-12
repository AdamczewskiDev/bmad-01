import { IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteMemberDto {
  @ApiProperty({ example: 'member@example.com', description: 'Email użytkownika do zaproszenia' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: false, description: 'Czy członek może edytować wszystkie transakcje (opcjonalne)', required: false })
  @IsOptional()
  @IsBoolean()
  canEditAll?: boolean;
}
