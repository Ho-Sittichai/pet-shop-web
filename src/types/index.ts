export interface User {
  id: number;
  username: string;
  fullName: string;
  telephone?: string;
  email: string;
  role: 'Admin' | 'User' | string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  fullName: string;
  telephone?: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
  createdAt: string;
}

export interface Pet {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  breed: string;
  age: number;
  ageUnit: string;
  gender: 'Male' | 'Female' | string;
  price: number;
  status: 'Available' | 'Adopted' | 'Pending' | string;
  healthStatus?: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  petId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  petId: number;
  petName: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | string;
  notes?: string;
  createdAt: string;
}

export interface CategoryStat {
  categoryName: string;
  count: number;
}

export interface DashboardSummary {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  pendingPets: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  categoryBreakdown: CategoryStat[];
  recentPets: Pet[];
  recentOrders: Order[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

export interface PetFilterParams {
  search?: string;
  categoryId?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
