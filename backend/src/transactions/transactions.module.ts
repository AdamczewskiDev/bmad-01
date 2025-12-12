import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { WalletsModule } from '../wallets/wallets.module';
import { FxModule } from '../fx/fx.module';
import { Transaction, Wallet, WalletMembership } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet, WalletMembership]),
    WalletsModule,
    FxModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
