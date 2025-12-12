import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BankTransaction } from './bank-transaction.entity';

@Entity('bank_connections')
export class BankConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bank: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  consentValidUntil: Date | null;

  @Column({ nullable: true, type: 'text' })
  refreshTokenEnc: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.bankConnections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => BankTransaction, (bt) => bt.bankConnection)
  bankTransactions: BankTransaction[];
}
