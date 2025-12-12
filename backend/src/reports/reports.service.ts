import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
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
    const where: any = {
      userId,
      type: 'EXPENSE',
    };
    if (walletId) where.walletId = walletId;
    if (startDate || endDate) {
      where.bookedAt = {};
      if (startDate) where.bookedAt = MoreThanOrEqual(startDate);
      if (endDate) where.bookedAt = { ...where.bookedAt, ...LessThanOrEqual(endDate) };
    }

    const transactions = await this.transactionRepository.find({
      where,
      select: ['bookedAt', 'amountBase'],
      order: { bookedAt: 'ASC' },
    });

    return transactions;
  }

  async getCategoryBreakdown(userId: string, walletId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (walletId) where.walletId = walletId;
    if (startDate || endDate) {
      where.bookedAt = {};
      if (startDate) where.bookedAt = MoreThanOrEqual(startDate);
      if (endDate) where.bookedAt = { ...where.bookedAt, ...LessThanOrEqual(endDate) };
    }

    const transactions = await this.transactionRepository.find({
      where,
      relations: ['category'],
    });

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
      .leftJoinAndSelect('wallet.transactions', 'transaction')
      .where('wallet.ownerId = :userId', { userId })
      .orWhere('EXISTS (SELECT 1 FROM wallet_memberships wm WHERE wm.walletId = wallet.id AND wm.userId = :userId)', { userId });

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
        progress: progress ? Math.min(100, progress) : null,
      };
    });
  }
}
