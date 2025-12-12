import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';
import { Category } from './category.entity';
import { BankTransaction } from './bank-transaction.entity';
import { TransactionType, Currency, TransactionSource } from './enums';

@Entity('transactions')
@Index(['walletId', 'bookedAt'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amountBase: number;

  @Column({ nullable: true, type: 'text' })
  note: string | null;

  @Column({ type: 'enum', enum: TransactionSource, default: TransactionSource.MANUAL })
  source: TransactionSource;

  @Column()
  bookedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  walletId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  categoryId: string | null;

  @Column({ nullable: true, unique: true })
  bankTransactionId: string | null;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @OneToOne(() => BankTransaction, (bt) => bt.transaction, { nullable: true })
  @JoinColumn({ name: 'bankTransactionId' })
  bankTransaction: BankTransaction | null;
}
