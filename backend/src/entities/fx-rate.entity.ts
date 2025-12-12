import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Currency } from './enums';

@Entity('fx_rates')
@Unique(['asOfDate', 'currency'])
export class FXRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  asOfDate: Date;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate: number;

  @Column({ default: 'NBP' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;
}
