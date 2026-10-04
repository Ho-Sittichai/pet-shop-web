import { ApiResponse, DashboardSummary, LoginResponse, PagedResult, Pet, PetFilterParams, Category, Order, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('petshop_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : 'Unknown network error';
      const lower = message.toLowerCase();
      if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('fetch failed') || lower.includes('load failed')) {
        message = 'Cannot connect to server. Please ensure the backend service is running.';
      }
      throw new Error(message);
    }
  }

  // Auth Endpoints
  auth = {
    login: async (credentials: { username: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
      return this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    register: async (userData: {
      username: string;
      password: string;
      fullName: string;
      telephone?: string;
      email: string;
      role: string;
    }): Promise<ApiResponse<LoginResponse>> => {
      return this.request<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    getProfile: async (): Promise<ApiResponse<User>> => {
      return this.request<User>('/auth/me', {
        method: 'GET',
      });
    },
  };

  // Pet Shop CRUD & Data Endpoints
  petshop = {
    getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
      return this.request<DashboardSummary>('/petshop/dashboard/summary', {
        method: 'GET',
      });
    },

    getPets: async (params: PetFilterParams = {}): Promise<ApiResponse<PagedResult<Pet>>> => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.categoryId) query.append('categoryId', params.categoryId.toString());
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      if (params.page) query.append('page', params.page.toString());
      if (params.pageSize) query.append('pageSize', params.pageSize.toString());

      const queryString = query.toString();
      const endpoint = queryString ? `/petshop/pets?${queryString}` : '/petshop/pets';
      return this.request<PagedResult<Pet>>(endpoint, { method: 'GET' });
    },

    getPetById: async (id: number): Promise<ApiResponse<Pet>> => {
      return this.request<Pet>(`/petshop/pets/${id}`, { method: 'GET' });
    },

    createPet: async (petData: Partial<Pet>): Promise<ApiResponse<Pet>> => {
      return this.request<Pet>('/petshop/pets', {
        method: 'POST',
        body: JSON.stringify(petData),
      });
    },

    updatePet: async (id: number, petData: Partial<Pet>): Promise<ApiResponse<Pet>> => {
      return this.request<Pet>(`/petshop/pets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(petData),
      });
    },

    deletePet: async (id: number): Promise<ApiResponse<boolean>> => {
      return this.request<boolean>(`/petshop/pets/${id}`, {
        method: 'DELETE',
      });
    },

    getCategories: async (): Promise<ApiResponse<Category[]>> => {
      return this.request<Category[]>('/petshop/categories', { method: 'GET' });
    },

    createCategory: async (categoryData: Partial<Category>): Promise<ApiResponse<Category>> => {
      return this.request<Category>('/petshop/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    },

    getOrders: async (): Promise<ApiResponse<Order[]>> => {
      return this.request<Order[]>('/petshop/orders', { method: 'GET' });
    },

    createOrder: async (orderData: {
      petId: number;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      paymentMethod?: string;
      notes?: string;
    }): Promise<ApiResponse<Order>> => {
      return this.request<Order>('/petshop/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
  };
}

export const api = new ApiService();
