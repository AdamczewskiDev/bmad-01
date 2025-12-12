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
  Unique,
} from 'typeorm';
import { BankConnection } from './bank-connection.entity';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';
import { Currency } from './enums';

@Entity('bank_transactions')
@Index(['bankConnectionId', 'bookedAt'])
@Unique(['bankConnectionId', 'externalId'])
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  externalId: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column()
  bookedAt: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  mapped: boolean;

  @Column({ type: 'jsonb', nullable: true })
  rawPayload: any;

  @Column({ nullable: true })
  mappedCategoryId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  bankConnectionId: string;

  @ManyToOne(() => BankConnection, (connection) => connection.bankTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bankConnectionId' })
  bankConnection: BankConnection;

  @ManyToOne(() => Category, (category) => category.mappedBankTransactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'mappedCategoryId' })
  mappedCategory: Category | null;

  @OneToOne(() => Transaction, (transaction) => transaction.bankTransaction, {
    nullable: true,
  })
  transaction: Transaction | null;
}
