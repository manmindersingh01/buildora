import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '@/types';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  const addToCart = (item: MenuItem) => {
    // Add to cart functionality
    console.log('Adding to cart:', item);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-xl text-gray-600">Handcrafted with the finest ingredients</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {items.length > 0 && items.map((item) => (
            <Card key={item.id} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.popular && (
                  <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">{item.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
                {item.ingredients && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.ingredients.slice(0, 3).map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button 
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};