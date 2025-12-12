import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, PasswordResetToken } from '../entities';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockPasswordResetTokenRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: mockPasswordResetTokenRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
    };

    it('powinien zarejestrować nowego użytkownika', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 'user-id',
        email: registerDto.email,
        password: hashedPassword,
        status: 'active',
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.register(registerDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          status: mockUser.status,
          createdAt: mockUser.createdAt,
        },
        token: 'jwt-token',
      });
    });

    it('powinien rzucić ConflictException gdy email już istnieje', async () => {
      const existingUser = {
        id: 'existing-user-id',
        email: registerDto.email,
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email jest już zarejestrowany',
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
    };

    it('powinien zalogować użytkownika z poprawnymi danymi', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        status: 'active',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        hashedPassword,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          status: mockUser.status,
        },
        token: 'jwt-token',
      });
    });

    it('powinien rzucić UnauthorizedException gdy użytkownik ma status nieaktywny', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        status: 'inactive',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Konto jest nieaktywne',
      );

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('powinien rzucić UnauthorizedException gdy użytkownik nie istnieje', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Nieprawidłowy email lub hasło',
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('powinien rzucić UnauthorizedException gdy hasło jest nieprawidłowe', async () => {
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        status: 'active',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const wrongLoginDto: LoginDto = {
        email: loginDto.email,
        password: wrongPassword,
      };

      await expect(service.login(wrongLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(wrongLoginDto)).rejects.toThrow(
        'Nieprawidłowy email lub hasło',
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        wrongPassword,
        hashedPassword,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('powinien utworzyć token resetu gdy użytkownik istnieje', async () => {
      const mockUser = {
        id: 'user-id',
        email: forgotPasswordDto.email,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockPasswordResetTokenRepository.save.mockResolvedValue({
        id: 'token-id',
        userId: mockUser.id,
        token: 'reset-token-uuid',
        expiresAt: new Date(),
        used: false,
      });

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: forgotPasswordDto.email },
      });
      expect(mockPasswordResetTokenRepository.save).toHaveBeenCalled();
      expect(result.message).toBe(
        'Jeśli email istnieje w systemie, link resetu został wysłany.',
      );
    });

    it('powinien zwrócić sukces nawet gdy użytkownik nie istnieje (bezpieczeństwo)', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: forgotPasswordDto.email },
      });
      expect(mockPasswordResetTokenRepository.save).not.toHaveBeenCalled();
      expect(result.message).toBe(
        'Jeśli email istnieje w systemie, link resetu został wysłany.',
      );
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'valid-token-uuid',
      newPassword: 'NewSecurePassword123!',
    };

    it('powinien zresetować hasło z poprawnym tokenem', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
      };

      const mockToken = {
        id: 'token-id',
        userId: mockUser.id,
        token: resetPasswordDto.token,
        expiresAt: new Date(Date.now() + 3600000), // 1 godzina w przyszłości
        used: false,
        user: mockUser,
      };

      mockPasswordResetTokenRepository.findOne.mockResolvedValue(mockToken);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      const result = await service.resetPassword(resetPasswordDto);

      expect(mockPasswordResetTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: resetPasswordDto.token },
        relations: ['user'],
      });
      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.newPassword, 10);
      expect(mockQueryRunner.manager.update).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result.message).toBe('Hasło zostało pomyślnie zresetowane');
    });

    it('powinien rzucić BadRequestException gdy token nie istnieje', async () => {
      mockPasswordResetTokenRepository.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Nieprawidłowy lub wygasły token',
      );

      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('powinien rzucić BadRequestException gdy token został już użyty', async () => {
      const mockToken = {
        id: 'token-id',
        userId: 'user-id',
        token: resetPasswordDto.token,
        expiresAt: new Date(Date.now() + 3600000),
        used: true,
      };

      mockPasswordResetTokenRepository.findOne.mockResolvedValue(mockToken);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Token został już użyty',
      );

      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('powinien rzucić BadRequestException gdy token wygasł', async () => {
      const mockToken = {
        id: 'token-id',
        userId: 'user-id',
        token: resetPasswordDto.token,
        expiresAt: new Date(Date.now() - 3600000), // 1 godzina w przeszłości
        used: false,
      };

      mockPasswordResetTokenRepository.findOne.mockResolvedValue(mockToken);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Token wygasł. Poproś o nowy link resetu',
      );

      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('powinien wykonać rollback gdy aktualizacja hasła się nie powiedzie', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
      };

      const mockToken = {
        id: 'token-id',
        userId: mockUser.id,
        token: resetPasswordDto.token,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
        user: mockUser,
      };

      mockPasswordResetTokenRepository.findOne.mockResolvedValue(mockToken);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockQueryRunner.manager.update.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Database error',
      );

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});

