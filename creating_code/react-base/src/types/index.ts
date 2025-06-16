export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  dueDate?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface FilterOptions {
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: string;
  searchTerm: string;
}