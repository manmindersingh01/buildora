import { useState, useEffect } from 'react';
import { Todo, TodoStats, FilterOptions } from '@/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos);
      setFilteredTodos(parsedTodos);
    }
    setIsLoading(false);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...todoData }
        : todo
    ));
    setEditingTodo(null);
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const filterTodos = (filters: FilterOptions) => {
    let filtered = [...todos];

    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(todo => 
        filters.status === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(todo => todo.category === filters.category);
    }

    setFilteredTodos(filtered);
  };

  const getStats = (): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => 
      todo.dueDate && 
      new Date(todo.dueDate) < new Date() && 
      !todo.completed
    ).length;

    return { total, completed, pending, overdue };
  };

  const getCategories = (): string[] => {
    const categories = Array.from(new Set(todos.map(todo => todo.category)));
    return categories.sort();
  };

  return {
    todos: filteredTodos,
    editingTodo,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    filterTodos,
    setEditingTodo,
    getStats,
    getCategories
  };
}