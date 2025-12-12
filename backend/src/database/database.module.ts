import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  Wallet,
  WalletMembership,
  Category,
  Transaction,
  FXRate,
  BankConnection,
  BankTransaction,
  AuditLog,
  PasswordResetToken,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          User,
          Wallet,
          WalletMembership,
          Category,
          Transaction,
          FXRate,
          BankConnection,
          BankTransaction,
          AuditLog,
          PasswordResetToken,
        ],
        synchronize: true, // W produkcji użyj migracji!
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
