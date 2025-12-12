import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User, PasswordResetToken } from '../entities';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    // Sprawdź czy email już istnieje
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email jest już zarejestrowany');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save({
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    // Sprawdź czy użytkownik ma status aktywny
    if (user.status !== 'active') {
      throw new UnauthorizedException('Konto jest nieaktywne');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, status: user.status },
      token,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Dla bezpieczeństwa zawsze zwracamy sukces, nawet jeśli email nie istnieje
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (user) {
      // Generuj unikalny token UUID
      const token = randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 godzina ważności

      // Zapis tokenu w bazie
      await this.passwordResetTokenRepository.save({
        userId: user.id,
        token,
        expiresAt,
        used: false,
      });

      // W fazie developmentu zwracamy token w odpowiedzi
      // W produkcji tutaj byłby kod wysyłający email
      return {
        message: 'Jeśli email istnieje w systemie, link resetu został wysłany.',
        // Tylko w development - usuń w produkcji!
        token: process.env.NODE_ENV === 'development' ? token : undefined,
      };
    }

    // Zwracamy ten sam komunikat dla bezpieczeństwa
    return {
      message: 'Jeśli email istnieje w systemie, link resetu został wysłany.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Znajdź token w bazie
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException('Nieprawidłowy lub wygasły token');
    }

    // Sprawdź czy token został już użyty
    if (resetToken.used) {
      throw new BadRequestException('Token został już użyty');
    }

    // Sprawdź czy token wygasł
    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token wygasł. Poproś o nowy link resetu');
    }

    // Użyj transakcji dla atomowości operacji
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Zaktualizuj hasło użytkownika
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      await queryRunner.manager.update(
        User,
        { id: resetToken.userId },
        { password: hashedPassword },
      );

      // Oznacz token jako użyty
      await queryRunner.manager.update(
        PasswordResetToken,
        { id: resetToken.id },
        { used: true },
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Hasło zostało pomyślnie zresetowane',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
