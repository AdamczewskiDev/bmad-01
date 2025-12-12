import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Category, Transaction, TransactionType } from '../entities';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(userId?: string) {
    return this.categoryRepository.find({
      where: userId
        ? [{ isDefault: true }, { userId }]
        : [{ isDefault: true }],
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.categoryRepository.save({
      ...dto,
      userId,
    });
  }

  async update(userId: string, id: string, dto: Partial<CreateCategoryDto>) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category || category.isDefault || category.userId !== userId) {
      throw new NotFoundException('Category not found or not editable');
    }

    return this.categoryRepository.update(id, dto);
  }

  async delete(userId: string, id: string, newCategoryId?: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category || category.isDefault || category.userId !== userId) {
      throw new NotFoundException('Category not found or not deletable');
    }

    if (newCategoryId) {
      await this.transactionRepository.update(
        { categoryId: id },
        { categoryId: newCategoryId },
      );
    }

    await this.categoryRepository.delete(id);
    return { id };
  }

  async seedDefaults() {
    const defaults = [
      { name: 'Jedzenie', type: TransactionType.EXPENSE },
      { name: 'Transport', type: TransactionType.EXPENSE },
      { name: 'Mieszkanie', type: TransactionType.EXPENSE },
      { name: 'Zdrowie', type: TransactionType.EXPENSE },
      { name: 'Rozrywka', type: TransactionType.EXPENSE },
      { name: 'Oszczędności', type: TransactionType.EXPENSE },
      { name: 'Inwestycje', type: TransactionType.EXPENSE },
      { name: 'Wynagrodzenie', type: TransactionType.INCOME },
      { name: 'Premia', type: TransactionType.INCOME },
      { name: 'Inne przychody', type: TransactionType.INCOME },
    ];

    for (const cat of defaults) {
      const existing = await this.categoryRepository.findOne({
        where: { name: cat.name, isDefault: true },
      });
      if (!existing) {
        await this.categoryRepository.save({
          ...cat,
          isDefault: true,
        });
      }
    }
  }
}
