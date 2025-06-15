import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TodoForm } from '@/components/TodoForm';
import { TodoItem } from '@/components/TodoItem';
import { TodoStats } from '@/components/TodoStats';
import { useTodos } from '@/hooks/useTodos';
import { Todo, TodoFilters } from '@/types';

const TodoApp: React.FC = () => {
  const { todos, loading, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'completed' && todo.completed) ||
                         (filters.status === 'pending' && !todo.completed);
    const matchesPriority = filters.priority === 'all' || todo.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || todo.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const categories = Array.from(new Set(todos.map(todo => todo.category).filter(Boolean)));

  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addTodo(todoData);
    setShowForm(false);
  };

  const handleEditTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodo(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo Master</h1>
          <p className="text-gray-600">Organize your tasks and boost productivity</p>
        </div>

        {/* Stats */}
        <TodoStats todos={todos} />

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={filters.status} onValueChange={(value: any) => setFilters({...filters, status: value})}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.priority} onValueChange={(value: any) => setFilters({...filters, priority: value})}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.category} onValueChange={(value: any) => setFilters({...filters, category: value})}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchTerm || filters.status !== 'all' ? 'No todos match your filters' : 'No todos yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filters.status !== 'all' ? 'Try adjusting your search or filters' : 'Start by adding your first todo'}
                </p>
                {!searchTerm && filters.status === 'all' && (
                  <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Todo
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={setEditingTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {/* Todo Form Modal */}
      {(showForm || editingTodo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingTodo ? 'Edit Todo' : 'Add New Todo'}
            </h2>
            <TodoForm
              initialData={editingTodo}
              onSubmit={editingTodo ? handleEditTodo : handleAddTodo}
              onCancel={() => {
                setShowForm(false);
                setEditingTodo(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;