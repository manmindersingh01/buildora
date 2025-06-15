import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Star } from 'lucide-react';
import { Pizza } from '@/types';

interface PizzaCardProps {
  pizza: Pizza;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'classic':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'specialty':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getCategoryColor(pizza.category)}>
            {pizza.category.charAt(0).toUpperCase() + pizza.category.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">4.8</span>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-gray-800 group-hover:text-red-600 transition-colors">
          {pizza.name}
        </CardTitle>
        <CardDescription className="text-gray-600 line-clamp-2">
          {pizza.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-red-600">${pizza.price}</span>
            <span className="text-sm text-gray-500">Starting from</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Sizes available:</div>
            <div className="flex gap-1">
              {pizza.sizes.map((size) => (
                <Badge key={size.name} variant="outline" className="text-xs">
                  {size.name.charAt(0)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {pizza.toppings && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Popular toppings:</p>
            <div className="flex flex-wrap gap-1">
              {pizza.toppings.slice(0, 3).map((topping) => (
                <Badge key={topping} variant="secondary" className="text-xs">
                  {topping}
                </Badge>
              ))}
              {pizza.toppings.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{pizza.toppings.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" className="px-3">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};