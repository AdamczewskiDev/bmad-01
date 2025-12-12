import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';
import { MembershipRole } from './enums';

@Entity('wallet_memberships')
@Unique(['walletId', 'userId'])
export class WalletMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MembershipRole, default: MembershipRole.MEMBER })
  role: MembershipRole;

  @Column({ default: false })
  canEditAll: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  walletId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
