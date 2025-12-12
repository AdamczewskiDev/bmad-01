export interface User {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  isDefault: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  baseCurrency: 'PLN' | 'EUR' | 'USD';
  goalAmount: number | null;
  limitAmount: number | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  memberships?: WalletMembership[];
  transactions?: Transaction[];
}

export interface WalletMembership {
  id: string;
  role: 'OWNER' | 'MEMBER';
  canEditAll: boolean;
  walletId: string;
  userId: string;
  createdAt: string;
  wallet?: Wallet;
  user?: User;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  currency: 'PLN' | 'EUR' | 'USD';
  amountBase: string;
  note?: string | null;
  source: 'MANUAL' | 'BANK';
  bookedAt: string;
  createdAt: string;
  updatedAt: string;
  walletId: string;
  userId: string;
  categoryId?: string | null;
  wallet?: Wallet;
  user?: User;
  category?: Category;
}

export interface AuthResponse {
  user: User;
  token: string;
}
