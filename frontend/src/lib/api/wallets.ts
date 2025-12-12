import api from '../api';

export interface Wallet {
  id: string;
  name: string;
  baseCurrency: 'PLN' | 'EUR' | 'USD';
  goalAmount: number | null;
  limitAmount: number | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: {
    id: string;
    email: string;
  };
  memberships?: Array<{
    id: string;
    role: string;
    canEditAll: boolean;
    user: {
      id: string;
      email: string;
    };
  }>;
}

export interface CreateWalletDto {
  name: string;
  baseCurrency: 'PLN' | 'EUR' | 'USD';
  goalAmount?: number;
  limitAmount?: number;
}

export interface InviteMemberDto {
  email: string;
  canEditAll?: boolean;
}

export const walletsApi = {
  getAll: async (): Promise<Wallet[]> => {
    const response = await api.get<Wallet[]>('/wallets');
    return response.data;
  },

  getOne: async (id: string): Promise<Wallet> => {
    const response = await api.get<Wallet>(`/wallets/${id}`);
    return response.data;
  },

  create: async (data: CreateWalletDto): Promise<Wallet> => {
    const response = await api.post<Wallet>('/wallets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateWalletDto>): Promise<Wallet> => {
    const response = await api.patch<Wallet>(`/wallets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/wallets/${id}`);
  },

  inviteMember: async (walletId: string, data: InviteMemberDto) => {
    const response = await api.post(`/wallets/${walletId}/invite`, data);
    return response.data;
  },

  updateMembership: async (walletId: string, memberId: string, canEditAll: boolean) => {
    const response = await api.patch(`/wallets/${walletId}/members/${memberId}`, { canEditAll });
    return response.data;
  },

  removeMember: async (walletId: string, memberId: string): Promise<void> => {
    await api.delete(`/wallets/${walletId}/members/${memberId}`);
  },
};
