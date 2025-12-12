import api from '../api';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

export interface CreateCategoryDto {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCategoryDto>): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string, newCategoryId?: string): Promise<void> => {
    const params = newCategoryId ? { newCategoryId } : {};
    await api.delete(`/categories/${id}`, { params });
  },
};
