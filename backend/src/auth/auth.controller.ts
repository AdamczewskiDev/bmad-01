import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard) // Throttling tylko dla tego kontrolera
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ long: { limit: 3, ttl: 1000 * 60 * 60 } }) // 3 próby na godzinę
  @ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
  @ApiResponse({ status: 201, description: 'Użytkownik został zarejestrowany' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe dane wejściowe' })
  @ApiResponse({ status: 409, description: 'Email jest już zarejestrowany' })
  @ApiResponse({ status: 429, description: 'Zbyt wiele prób. Spróbuj ponownie za godzinę.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 1000 * 60 * 15 } }) // 5 prób na 15 minut
  @ApiOperation({ summary: 'Logowanie użytkownika' })
  @ApiResponse({ status: 200, description: 'Logowanie pomyślne, zwraca token JWT' })
  @ApiResponse({ status: 401, description: 'Nieprawidłowe dane logowania' })
  @ApiResponse({ status: 429, description: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @Throttle({ long: { limit: 3, ttl: 1000 * 60 * 60 } }) // 3 próby na godzinę
  @ApiOperation({ summary: 'Żądanie resetu hasła' })
  @ApiResponse({
    status: 200,
    description: 'Jeśli email istnieje, link resetu został wysłany (w development zwracany token)',
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowy email' })
  @ApiResponse({ status: 429, description: 'Zbyt wiele prób. Spróbuj ponownie za godzinę.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Throttle({ short: { limit: 5, ttl: 1000 * 60 * 15 } }) // 5 prób na 15 minut - ochrona przed brute-force tokenów
  @ApiOperation({ summary: 'Reset hasła używając tokenu' })
  @ApiResponse({ status: 200, description: 'Hasło zostało pomyślnie zresetowane' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowy, wygasły lub użyty token' })
  @ApiResponse({ status: 429, description: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
