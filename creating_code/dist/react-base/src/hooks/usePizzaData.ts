import { useState, useEffect } from 'react';
import { Pizza, Testimonial } from '@/types';
import axios from 'axios';

interface UsePizzaDataReturn {
  pizzas: Pizza[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

export const usePizzaData = (): UsePizzaDataReturn => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API calls
        const mockPizzas: Pizza[] = [
          {
            id: '1',
            name: 'Margherita Classic',
            description: 'Fresh mozzarella, tomato sauce, and basil on our signature thin crust',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
            category: 'classic',
            ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
            popular: true
          },
          {
            id: '2',
            name: 'Pepperoni Supreme',
            description: 'Premium pepperoni, mozzarella cheese, and our secret sauce',
            price: 17.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
            category: 'classic',
            ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Oregano'],
            popular: true
          },
          {
            id: '3',
            name: 'Meat Lovers Deluxe',
            description: 'Pepperoni, sausage, bacon, and ham with extra cheese',
            price: 21.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            category: 'specialty',
            ingredients: ['Pepperoni', 'Italian Sausage', 'Bacon', 'Ham', 'Mozzarella']
          },
          {
            id: '4',
            name: 'Veggie Garden',
            description: 'Bell peppers, mushrooms, onions, olives, and fresh tomatoes',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop',
            category: 'vegan',
            ingredients: ['Bell Peppers', 'Mushrooms', 'Red Onions', 'Black Olives', 'Fresh Tomatoes']
          },
          {
            id: '5',
            name: 'BBQ Chicken Ranch',
            description: 'Grilled chicken, BBQ sauce, red onions, and ranch dressing',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1565564242292-d747bb44fb69?w=400&h=300&fit=crop',
            category: 'specialty',
            ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Ranch', 'Mozzarella']
          },
          {
            id: '6',
            name: 'Hawaiian Paradise',
            description: 'Ham, pineapple, and mozzarella cheese on tomato base',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1576458088443-04a19d13da1b?w=400&h=300&fit=crop',
            category: 'classic',
            ingredients: ['Ham', 'Pineapple', 'Mozzarella', 'Tomato Sauce']
          }
        ];

        const mockTestimonials: Testimonial[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Best pizza in town! The crust is perfectly crispy and the ingredients are always fresh. Mario\'s has become our family\'s go-to place for pizza night.'
          },
          {
            id: '2',
            name: 'Mike Rodriguez',
            rating: 5,
            comment: 'Amazing flavors and great service. The Meat Lovers Deluxe is incredible - loaded with toppings and cooked to perfection every time.'
          },
          {
            id: '3',
            name: 'Emma Davis',
            rating: 4,
            comment: 'Love their veggie options! As a vegetarian, it\'s hard to find places with good variety, but Mario\'s delivers both taste and quality.'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPizzas(mockPizzas);
        setTestimonials(mockTestimonials);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { pizzas, testimonials, loading, error };
};