import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
          <Badge className="bg-white/20 text-white border-white/30">
            {category.productCount} products
          </Badge>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Explore Collection</span>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </CardContent>
    </Card>
  );
};