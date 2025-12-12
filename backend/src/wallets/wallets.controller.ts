import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('wallets')
@ApiBearerAuth('JWT-auth')
@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.walletsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walletsService.findOne(user.userId, id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateWalletDto) {
    return this.walletsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateWalletDto>,
  ) {
    return this.walletsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walletsService.delete(user.userId, id);
  }

  @Post(':id/invite')
  inviteMember(
    @CurrentUser() user: any,
    @Param('id') walletId: string,
    @Body() dto: InviteMemberDto,
  ) {
    return this.walletsService.inviteMember(user.userId, walletId, dto);
  }

  @Patch(':id/members/:memberId')
  updateMembership(
    @CurrentUser() user: any,
    @Param('id') walletId: string,
    @Param('memberId') memberId: string,
    @Body() body: { canEditAll: boolean },
  ) {
    return this.walletsService.updateMembership(
      user.userId,
      walletId,
      memberId,
      body.canEditAll,
    );
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @CurrentUser() user: any,
    @Param('id') walletId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.walletsService.removeMember(user.userId, walletId, memberId);
  }
}
