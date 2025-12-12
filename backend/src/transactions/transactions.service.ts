import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, Wallet, WalletMembership, Currency } from '../entities';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WalletsService } from '../wallets/wallets.service';
import { FxService } from '../fx/fx.service';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletMembership)
    private membershipRepository: Repository<WalletMembership>,
    private walletsService: WalletsService,
    private fxService: FxService,
  ) {}

  async findAll(userId: string, walletId?: string) {
    const where: any = { userId };
    if (walletId) {
      where.walletId = walletId;
      const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
      if (!wallet) throw new NotFoundException('Wallet not found');
      const hasAccess =
        wallet.ownerId === userId ||
        (await this.membershipRepository.findOne({
          where: { walletId, userId },
        }));
      if (!hasAccess) throw new ForbiddenException('Access denied');
    }

    return this.transactionRepository.find({
      where,
      relations: ['category', 'wallet', 'user'],
      order: { bookedAt: 'DESC' },
      take: 100,
    });
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'wallet', 'user'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const canEdit = await this.walletsService.canEditTransaction(
      userId,
      transaction.walletId,
      transaction.userId,
    );
    if (!canEdit) throw new ForbiddenException('Access denied');

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const wallet = await this.walletRepository.findOne({ where: { id: dto.walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const hasAccess =
      wallet.ownerId === userId ||
      (await this.membershipRepository.findOne({
        where: { walletId: dto.walletId, userId },
      }));
    if (!hasAccess) throw new ForbiddenException('Access denied');

    const amount = new Decimal(dto.amount);
    const bookedAt = dto.bookedAt ? new Date(dto.bookedAt) : new Date();
    const amountBase = await this.fxService.convertToBase(
      amount,
      dto.currency as Currency,
      wallet.baseCurrency,
      bookedAt,
    );

    const saved = await this.transactionRepository.save({
      type: dto.type,
      amount: amount.toNumber(),
      currency: dto.currency as Currency,
      amountBase: amountBase.toNumber(),
      walletId: dto.walletId,
      userId,
      categoryId: dto.categoryId,
      note: dto.note,
      bookedAt,
    } as Partial<Transaction>);
    const savedEntity = Array.isArray(saved) ? saved[0] : saved;

    return this.transactionRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['category', 'wallet'],
    });
  }

  async update(userId: string, id: string, dto: Partial<CreateTransactionDto>) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const canEdit = await this.walletsService.canEditTransaction(
      userId,
      transaction.walletId,
      transaction.userId,
    );
    if (!canEdit) throw new ForbiddenException('Access denied');

    const updateData: any = {};
    if (dto.amount !== undefined || dto.currency !== undefined) {
      const amount = dto.amount !== undefined ? new Decimal(dto.amount) : new Decimal(transaction.amount);
      const currency = dto.currency || transaction.currency;
      const bookedAt = dto.bookedAt ? new Date(dto.bookedAt) : transaction.bookedAt;
      updateData.amount = amount.toNumber();
      updateData.currency = currency as Currency;
      updateData.amountBase = (await this.fxService.convertToBase(
        amount,
        currency as Currency,
        transaction.wallet.baseCurrency,
        bookedAt,
      )).toNumber();
      if (dto.bookedAt) updateData.bookedAt = new Date(dto.bookedAt);
    }
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.note !== undefined) updateData.note = dto.note;

    await this.transactionRepository.update(id, updateData);

    return this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'wallet'],
    });
  }

  async delete(userId: string, id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const canEdit = await this.walletsService.canEditTransaction(
      userId,
      transaction.walletId,
      transaction.userId,
    );
    if (!canEdit) throw new ForbiddenException('Access denied');

    await this.transactionRepository.delete(id);
    return { id };
  }
}
