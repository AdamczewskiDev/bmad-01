import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet, WalletMembership, User } from '../entities';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { MembershipRole } from '../entities';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletMembership)
    private membershipRepository: Repository<WalletMembership>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userId: string) {
    return this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.owner', 'owner')
      .leftJoinAndSelect('wallet.memberships', 'membership')
      .leftJoinAndSelect('membership.user', 'memberUser')
      .where('wallet.ownerId = :userId', { userId })
      .orWhere('membership.userId = :userId', { userId })
      .getMany();
  }

  async findOne(userId: string, id: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'memberships',
        'memberships.user',
        'transactions',
        'transactions.category',
        'transactions.user',
      ],
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    const hasAccess =
      wallet.ownerId === userId ||
      wallet.memberships.some((m) => m.userId === userId);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    return wallet;
  }

  async create(userId: string, dto: CreateWalletDto) {
    const saved = await this.walletRepository.save({
      ...dto,
      ownerId: userId,
      goalAmount: dto.goalAmount || null,
      limitAmount: dto.limitAmount || null,
    } as Partial<Wallet>);
    const savedEntity = Array.isArray(saved) ? saved[0] : saved;

    return this.walletRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['owner', 'memberships'],
    });
  }

  async update(userId: string, id: string, dto: Partial<CreateWalletDto>) {
    const wallet = await this.walletRepository.findOne({ where: { id } });
    if (!wallet || wallet.ownerId !== userId) {
      throw new ForbiddenException('Only owner can update wallet');
    }

    await this.walletRepository.update(id, {
      name: dto.name,
      goalAmount: dto.goalAmount !== undefined ? dto.goalAmount : wallet.goalAmount,
      limitAmount: dto.limitAmount !== undefined ? dto.limitAmount : wallet.limitAmount,
    });

    return this.walletRepository.findOne({ where: { id } });
  }

  async delete(userId: string, id: string) {
    const wallet = await this.walletRepository.findOne({ where: { id } });
    if (!wallet || wallet.ownerId !== userId) {
      throw new ForbiddenException('Only owner can delete wallet');
    }

    await this.walletRepository.delete(id);
    return { id };
  }

  async inviteMember(ownerId: string, walletId: string, dto: InviteMemberDto) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
    if (!wallet || wallet.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can invite members');
    }

    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    let membership = await this.membershipRepository.findOne({
      where: { walletId, userId: user.id },
    });

    if (membership) {
      membership.canEditAll = dto.canEditAll ?? false;
      return this.membershipRepository.save(membership);
    }

    return this.membershipRepository.save({
      walletId,
      userId: user.id,
      role: MembershipRole.MEMBER,
      canEditAll: dto.canEditAll ?? false,
    });
  }

  async updateMembership(
    ownerId: string,
    walletId: string,
    memberId: string,
    canEditAll: boolean,
  ) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
    if (!wallet || wallet.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can update memberships');
    }

    await this.membershipRepository.update(
      { walletId, userId: memberId },
      { canEditAll },
    );

    return this.membershipRepository.findOne({
      where: { walletId, userId: memberId },
    });
  }

  async removeMember(ownerId: string, walletId: string, memberId: string) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
    if (!wallet || wallet.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can remove members');
    }

    await this.membershipRepository.delete({ walletId, userId: memberId });
    return { walletId, userId: memberId };
  }

  async canEditTransaction(userId: string, walletId: string, transactionUserId?: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['memberships'],
    });

    if (!wallet) return false;
    if (wallet.ownerId === userId) return true;

    const membership = wallet.memberships.find((m) => m.userId === userId);
    if (!membership) return false;

    if (membership.canEditAll) return true;
    return transactionUserId === userId;
  }
}
