import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('expenses-over-time')
  getExpensesOverTime(
    @CurrentUser() user: any,
    @Query('walletId') walletId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getExpensesOverTime(
      user.userId,
      walletId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('category-breakdown')
  getCategoryBreakdown(
    @CurrentUser() user: any,
    @Query('walletId') walletId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getCategoryBreakdown(
      user.userId,
      walletId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('goal-progress')
  getGoalProgress(@CurrentUser() user: any, @Query('walletId') walletId?: string) {
    return this.reportsService.getGoalProgress(user.userId, walletId);
  }
}
