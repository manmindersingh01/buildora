import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pizza } from '@/types';
import { Star } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart?: (pizza: Pizza) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {pizza.popular && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            Popular
          </Badge>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-lg font-bold text-gray-800">${pizza.price}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pizza.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pizza.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {pizza.ingredients.slice(0, 3).map((ingredient, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-gray-50 text-gray-600"
            >
              {ingredient}
            </Badge>
          ))}
          {pizza.ingredients.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
              +{pizza.ingredients.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={pizza.category === 'specialty' ? 'default' : 'secondary'}
            className={`capitalize ${
              pizza.category === 'specialty' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
              pizza.category === 'vegan' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {pizza.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart?.(pizza)}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium"
        >
          Add to Cart - ${pizza.price}
        </Button>
      </CardFooter>
    </Card>
  );
};