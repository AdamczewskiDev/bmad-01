import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { Wallet, WalletMembership, User } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletMembership, User])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
