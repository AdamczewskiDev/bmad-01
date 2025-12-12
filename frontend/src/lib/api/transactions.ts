import api from '../api';

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  currency: 'PLN' | 'EUR' | 'USD';
  amountBase: string;
  note: string | null;
  source: 'MANUAL' | 'BANK';
  bookedAt: string;
  createdAt: string;
  updatedAt: string;
  walletId: string;
  userId: string;
  categoryId: string | null;
  wallet?: {
    id: string;
    name: string;
    baseCurrency: string;
  };
  category?: {
    id: string;
    name: string;
    type: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

export interface CreateTransactionDto {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: 'PLN' | 'EUR' | 'USD';
  walletId: string;
  categoryId?: string;
  note?: string;
  bookedAt?: string;
}

export const transactionsApi = {
  getAll: async (walletId?: string): Promise<Transaction[]> => {
    const params = walletId ? { walletId } : {};
    const response = await api.get<Transaction[]>('/transactions', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTransactionDto>): Promise<Transaction> => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
