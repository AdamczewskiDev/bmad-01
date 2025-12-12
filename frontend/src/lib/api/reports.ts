import api from '../api';

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface GoalProgress {
  walletId: string;
  walletName: string;
  goalAmount: number | null;
  currentAmount: number;
  progress: number | null;
}

export const reportsApi = {
  getExpensesOverTime: async (
    walletId?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    const params: any = {};
    if (walletId) params.walletId = walletId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/reports/expenses-over-time', { params });
    return response.data;
  },

  getCategoryBreakdown: async (
    walletId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<CategoryBreakdown[]> => {
    const params: any = {};
    if (walletId) params.walletId = walletId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get<CategoryBreakdown[]>('/reports/category-breakdown', {
      params,
    });
    return response.data;
  },

  getGoalProgress: async (walletId?: string): Promise<GoalProgress[]> => {
    const params = walletId ? { walletId } : {};
    const response = await api.get<GoalProgress[]>('/reports/goal-progress', { params });
    return response.data;
  },
};
