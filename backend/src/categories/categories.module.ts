import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, Transaction } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Transaction])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule implements OnModuleInit {
  constructor(private categoriesService: CategoriesService) {}

  async onModuleInit() {
    await this.categoriesService.seedDefaults();
  }
}
