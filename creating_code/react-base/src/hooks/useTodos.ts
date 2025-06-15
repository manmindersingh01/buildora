import { useState, useEffect } from 'react';
import { Todo } from '@/types';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt)
          }));
          setTodos(parsedTodos);
        } else {
          // Initialize with sample data
          const sampleTodos: Todo[] = [
            {
              id: '1',
              title: 'Complete project documentation',
              description: 'Write comprehensive documentation for the new feature',
              completed: false,
              priority: 'high',
              category: 'Work',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '2',
              title: 'Buy groceries',
              description: 'Milk, bread, eggs, and vegetables',
              completed: true,
              priority: 'medium',
              category: 'Personal',
              createdAt: new Date(Date.now() - 86400000),
              updatedAt: new Date()
            },
            {
              id: '3',
              title: 'Plan weekend trip',
              description: 'Research destinations and book accommodations',
              completed: false,
              priority: 'low',
              category: 'Personal',
              createdAt: new Date(Date.now() - 172800000),
              updatedAt: new Date(Date.now() - 172800000)
            }
          ];
          setTodos(sampleTodos);
          localStorage.setItem('todos', JSON.stringify(sampleTodos));
        }
      } catch (error) {
        console.error('Error loading todos:', error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadTodos, 500);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading && todos.length >= 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, loading]);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const toggleTodo = async (id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  };
};