import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pizza } from '@/types';
import { ShoppingCart, Star } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vegetarian':
        return 'bg-green-100 text-green-800';
      case 'non-vegetarian':
        return 'bg-red-100 text-red-800';
      case 'specialty':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getCategoryColor(pizza.category)}>
            {pizza.category.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
          {pizza.name}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {pizza.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {pizza.ingredients.slice(0, 4).map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
            {pizza.ingredients.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{pizza.ingredients.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            ${pizza.price.toFixed(2)}
          </div>
          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 group">
            <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};