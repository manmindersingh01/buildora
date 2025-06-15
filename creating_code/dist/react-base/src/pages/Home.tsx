import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, Pizza, Heart, ShoppingCart } from 'lucide-react';
import { MenuItem, Review } from '@/types';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MenuSection } from '@/components/MenuSection';
import { TestimonialCard } from '@/components/TestimonialCard';
import axios from 'axios';

const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock API calls - replace with actual endpoints
        const pizzasResponse = await axios.get('/api/menu/featured');
        const reviewsResponse = await axios.get('/api/reviews');
        
        if (pizzasResponse.data.success) {
          setFeaturedPizzas(pizzasResponse.data.data);
        }
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data
        setFeaturedPizzas([
          {
            id: '1',
            name: 'Margherita Supreme',
            description: 'Fresh tomato sauce, mozzarella cheese, and basil leaves',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
            category: 'pizza',
            popular: true,
            ingredients: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil']
          },
          {
            id: '2',
            name: 'Pepperoni Deluxe',
            description: 'Classic pepperoni with extra cheese and oregano',
            price: 22.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            category: 'pizza',
            popular: true,
            ingredients: ['Pepperoni', 'Mozzarella', 'Oregano']
          },
          {
            id: '3',
            name: 'Veggie Garden',
            description: 'Bell peppers, mushrooms, onions, and olives',
            price: 20.99,
            image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400',
            category: 'pizza',
            ingredients: ['Bell Peppers', 'Mushrooms', 'Onions', 'Olives']
          }
        ]);
        
        setReviews([
          {
            id: '1',
            customerName: 'Sarah Johnson',
            rating: 5,
            comment: 'Best pizza in town! The crust is perfectly crispy and the toppings are always fresh.',
            date: new Date('2024-01-15')
          },
          {
            id: '2',
            customerName: 'Mike Chen',
            rating: 5,
            comment: 'Amazing service and delicious food. The Margherita Supreme is my favorite!',
            date: new Date('2024-01-10')
          },
          {
            id: '3',
            customerName: 'Emma Davis',
            rating: 4,
            comment: 'Great variety of pizzas and fast delivery. Highly recommended!',
            date: new Date('2024-01-08')
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Pizza className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Mario's Pizzeria
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Authentic Italian Pizzas Made with Love & Fresh Ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-orange-100 text-lg px-8 py-3">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-3">
                View Menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot and fresh pizzas delivered in 30 minutes or less</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">Only the finest and freshest ingredients in every pizza</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Top Rated</h3>
              <p className="text-gray-600">Rated #1 pizzeria in the city by our customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <MenuSection 
        title="Featured Pizzas" 
        items={featuredPizzas.length > 0 ? featuredPizzas.slice(0, 3) : []} 
      />

      {/* About Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Since 1985, Mario's Pizzeria has been serving authentic Italian pizzas 
                to our beloved community. Started by Mario Rossi, our family recipe 
                has been passed down through generations.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We use only the finest imported Italian ingredients and traditional 
                wood-fired ovens to create the perfect pizza experience.
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" 
                alt="Pizza making" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">39+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.length > 0 && reviews.slice(0, 3).map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Location */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-red-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Us Today</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-red-400 mr-3" />
                  <span className="text-lg">123 Pizza Street, Food District, City 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-red-400 mr-3" />
                  <span className="text-lg">(555) 123-PIZZA</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-red-400 mr-3" />
                  <span className="text-lg">Open Daily: 11:00 AM - 11:00 PM</span>
                </div>
              </div>
              <Button className="mt-8 bg-red-600 hover:bg-red-700" size="lg">
                Get Directions
              </Button>
            </div>
            <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">Special Offers</h3>
              <div className="space-y-4">
                <div className="bg-red-600/20 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-300">Family Deal</h4>
                  <p>2 Large Pizzas + 4 Drinks = $39.99</p>
                </div>
                <div className="bg-orange-600/20 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-300">Weekday Special</h4>
                  <p>Buy 1 Get 1 Half Off (Mon-Thu)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;