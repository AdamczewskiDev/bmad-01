import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletMembership } from './wallet-membership.entity';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';
import { BankConnection } from './bank-connection.entity';
import { AuditLog } from './audit-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.owner)
  wallets: Wallet[];

  @OneToMany(() => WalletMembership, (membership) => membership.user)
  memberships: WalletMembership[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => BankConnection, (connection) => connection.user)
  bankConnections: BankConnection[];

  @OneToMany(() => AuditLog, (log) => log.actor)
  auditLogs: AuditLog[];
}
