import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  findAll(@CurrentUser() user: any, @Query('walletId') walletId?: string) {
    return this.transactionsService.findAll(user.userId, walletId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionsService.findOne(user.userId, id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTransactionDto>,
  ) {
    return this.transactionsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionsService.delete(user.userId, id);
  }
}
