import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Phone, MapPin, Pizza as PizzaIcon, ChefHat, Users } from 'lucide-react';
import { Pizza, Review } from '@/types';
import { PizzaCard } from '@/components/PizzaCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import axios from 'axios';

export const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPizzas();
    fetchReviews();
  }, []);

  const fetchFeaturedPizzas = async () => {
    try {
      const response = await axios.get('/api/pizzas/featured');
      if (response.data.success) {
        setFeaturedPizzas(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching featured pizzas:', error);
      // Fallback data for development
      setFeaturedPizzas([
        {
          id: '1',
          name: 'Margherita Supreme',
          description: 'Fresh mozzarella, tomatoes, and basil on our signature crust',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
          category: 'classic',
          sizes: [
            { name: 'Small', price: 16.99, multiplier: 1 },
            { name: 'Medium', price: 20.99, multiplier: 1.2 },
            { name: 'Large', price: 24.99, multiplier: 1.4 }
          ]
        },
        {
          id: '2',
          name: 'Pepperoni Deluxe',
          description: 'Premium pepperoni with extra cheese and our secret sauce',
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
          category: 'classic',
          sizes: [
            { name: 'Small', price: 18.99, multiplier: 1 },
            { name: 'Medium', price: 22.99, multiplier: 1.2 },
            { name: 'Large', price: 26.99, multiplier: 1.4 }
          ]
        },
        {
          id: '3',
          name: 'Meat Lovers',
          description: 'Pepperoni, sausage, ham, and bacon for the ultimate meat experience',
          price: 22.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          category: 'premium',
          sizes: [
            { name: 'Small', price: 22.99, multiplier: 1 },
            { name: 'Medium', price: 26.99, multiplier: 1.2 },
            { name: 'Large', price: 30.99, multiplier: 1.4 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/recent');
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback data for development
      setReviews([
        {
          id: '1',
          customerName: 'Sarah Johnson',
          rating: 5,
          comment: 'Best pizza in town! The crust is perfect and toppings are always fresh.',
          date: '2024-01-15',
          pizzaName: 'Margherita Supreme'
        },
        {
          id: '2',
          customerName: 'Mike Chen',
          rating: 5,
          comment: 'Amazing service and delicious pizza. The Meat Lovers is incredible!',
          date: '2024-01-14',
          pizzaName: 'Meat Lovers'
        },
        {
          id: '3',
          customerName: 'Emily Davis',
          rating: 4,
          comment: 'Great variety and quick delivery. Will definitely order again!',
          date: '2024-01-13',
          pizzaName: 'Pepperoni Deluxe'
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              Tony's Pizza Palace
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
              Authentic Italian pizzas made with love and the finest ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 text-lg">
                View Menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <PizzaIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-gray-600">Pizza Varieties</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">10K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <ChefHat className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">15+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Pizzas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular pizzas, crafted with premium ingredients and traditional techniques
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded mb-4"></div>
                  <div className="bg-gray-300 h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPizzas.length > 0 && featuredPizzas.map((pizza) => (
                <PizzaCard key={pizza.id} pizza={pizza} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">About Tony's Pizza Palace</h2>
              <p className="text-lg text-gray-600 mb-6">
                Since 2009, we've been serving authentic Italian pizzas made with the finest ingredients. 
                Our wood-fired ovens and traditional recipes create the perfect combination of crispy crust 
                and fresh toppings that keep our customers coming back.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">Fresh dough made daily</span>
                </div>
                <div className="flex items-center gap-3">
                  <ChefHat className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">Authentic Italian recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <PizzaIcon className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">Wood-fired oven cooking</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600" 
                alt="Pizza chef at work" 
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length > 0 && reviews.map((review) => (
              <Card key={review.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{review.customerName}</CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>Ordered: {review.pizzaName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Hours */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Our Restaurant</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-400" />
                  <span>123 Pizza Street, Little Italy, NY 10013</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-400" />
                  <span>(555) 123-PIZZA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-400" />
                  <div>
                    <p>Mon-Thu: 11AM - 10PM</p>
                    <p>Fri-Sat: 11AM - 11PM</p>
                    <p>Sun: 12PM - 9PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
              <p className="text-lg mb-6 text-gray-300">
                Experience the best pizza in town. Order online for pickup or delivery!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Order Online
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};