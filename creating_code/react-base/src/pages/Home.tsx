import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pizza, Testimonial } from '@/types';
import { Star, Clock, Truck, Phone, MapPin, ChefHat, Award, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PizzaCard } from '@/components/PizzaCard';
import axios from 'axios';

export const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for featured pizzas
  const mockPizzas: Pizza[] = [
    {
      id: '1',
      name: 'Margherita Supreme',
      description: 'Fresh mozzarella, basil, and premium tomato sauce',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
      category: 'vegetarian',
      size: 'medium',
      ingredients: ['Fresh Mozzarella', 'Basil', 'Tomato Sauce', 'Olive Oil']
    },
    {
      id: '2', 
      name: 'Pepperoni Deluxe',
      description: 'Premium pepperoni with extra cheese and Italian herbs',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
      category: 'non-vegetarian',
      size: 'medium',
      ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Italian Herbs']
    },
    {
      id: '3',
      name: 'Quattro Formaggi',
      description: 'Four cheese blend with truffle oil and herbs',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop',
      category: 'vegetarian',
      size: 'medium',
      ingredients: ['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta', 'Truffle Oil']
    }
  ];

  const mockTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Best pizza in town! The crust is perfect and ingredients are always fresh.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Mike Chen',
      rating: 5,
      comment: 'Amazing flavors and fast delivery. My family\'s favorite pizza place!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls
        // const pizzaResponse = await axios.get('/api/pizzas/featured');
        // const testimonialResponse = await axios.get('/api/testimonials');
        
        // For now, using mock data
        setTimeout(() => {
          setFeaturedPizzas(mockPizzas);
          setTestimonials(mockTestimonials);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            My Place
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Welcome to my place, where you can enjoy a cozy atmosphere and great company
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg">
              Order Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg">
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Hot and fresh pizzas delivered in 30 minutes or less</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-gray-400">Trained in traditional Italian pizza-making techniques</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
              <p className="text-gray-400">Fresh, locally sourced ingredients for the perfect taste</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Pizzas</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover our most popular and chef-recommended pizzas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPizzas.length > 0 && featuredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700">
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-400 mb-6">
                Established recently, my place has been a welcoming spot for friends and family 
                to gather and enjoy good times together. We create a warm and inviting atmosphere 
                that feels just like home.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Every visit to my place is filled with laughter, great conversations, and memorable 
                moments that keep our guests coming back.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-gray-400">Pizza Varieties</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop" 
                alt="Pizza chef preparing dough"
                className="rounded-lg shadow-2xl grayscale"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-black p-4 rounded-lg shadow-lg">
                <Users className="h-6 w-6 mb-2" />
                <div className="text-sm font-semibold">Friendly Environment</div>
                <div className="text-xs">Always Welcome</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400">Don't just take our word for it</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.length > 0 && testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 grayscale"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-white fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Location */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Come Over Today</h2>
            <p className="text-xl text-gray-400">Experience the warmth and comfort of my place</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-white mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-gray-400">123 Friendly Street, Neighborhood<br />Your City, State 12345</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-white mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">(555) 123-PIZZA</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-white mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Hours</h4>
                  <p className="text-gray-400">
                    Mon-Thu: 11AM - 10PM<br />
                    Fri-Sat: 11AM - 11PM<br />
                    Sunday: 12PM - 9PM
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Truck className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Free Delivery</h3>
              <p className="text-gray-400 mb-6">On orders over $25 within 5 miles</p>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Order for Delivery
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};