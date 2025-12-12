import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Transaction, Wallet } from '../entities';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getExpensesOverTime(
    userId: string,
    walletId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'EXPENSE' });

    if (walletId) {
      queryBuilder.andWhere('transaction.walletId = :walletId', { walletId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.bookedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('transaction.bookedAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('transaction.bookedAt <= :endDate', { endDate });
    }

    const transactions = await queryBuilder
      .select(['transaction.bookedAt', 'transaction.amountBase'])
      .orderBy('transaction.bookedAt', 'ASC')
      .getMany();

    return transactions;
  }

  async getCategoryBreakdown(userId: string, walletId?: string, startDate?: Date, endDate?: Date) {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'EXPENSE' });

    if (walletId) {
      queryBuilder.andWhere('transaction.walletId = :walletId', { walletId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.bookedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('transaction.bookedAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('transaction.bookedAt <= :endDate', { endDate });
    }

    const transactions = await queryBuilder.getMany();

    const breakdown = transactions.reduce((acc, tx) => {
      const catName = tx.category?.name || 'Brak kategorii';
      if (!acc[catName]) {
        acc[catName] = { category: catName, total: 0, count: 0 };
      }
      acc[catName].total += Number(tx.amountBase);
      acc[catName].count += 1;
      return acc;
    }, {} as Record<string, { category: string; total: number; count: number }>);

    return Object.values(breakdown);
  }

  async getGoalProgress(userId: string, walletId?: string) {
    const query = this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.transactions', 'transaction', 'transaction.type = :incomeType', {
        incomeType: 'INCOME',
      })
      .where(
        '(wallet.ownerId = :userId OR EXISTS (SELECT 1 FROM wallet_memberships wm WHERE wm.walletId = wallet.id AND wm.userId = :userId))',
        { userId },
      );

    if (walletId) {
      query.andWhere('wallet.id = :walletId', { walletId });
    }

    const wallets = await query.getMany();

    return wallets.map((wallet) => {
      const totalIncome = wallet.transactions
        .filter((tx) => tx.type === 'INCOME')
        .reduce((sum, tx) => sum + Number(tx.amountBase), 0);
      const progress = wallet.goalAmount
        ? (totalIncome / Number(wallet.goalAmount)) * 100
        : null;

      return {
        walletId: wallet.id,
        walletName: wallet.name,
        goalAmount: wallet.goalAmount ? Number(wallet.goalAmount) : null,
        currentAmount: totalIncome,
        progress: progress ? Math.min(100, Math.max(0, progress)) : null,
      };
    });
  }
}
