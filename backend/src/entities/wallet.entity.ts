import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { WalletMembership } from './wallet-membership.entity';
import { Transaction } from './transaction.entity';
import { Currency } from './enums';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Currency })
  baseCurrency: Currency;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  goalAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  limitAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => WalletMembership, (membership) => membership.wallet)
  memberships: WalletMembership[];

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
