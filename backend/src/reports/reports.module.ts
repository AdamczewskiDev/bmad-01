import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Transaction, Wallet } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
