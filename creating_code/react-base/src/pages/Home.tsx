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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Authentic Italian Pizza
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Hand-tossed, wood-fired pizzas made with the finest ingredients and traditional recipes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg">
              Order Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg">
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot and fresh pizzas delivered in 30 minutes or less</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-gray-600">Trained in traditional Italian pizza-making techniques</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
              <p className="text-gray-600">Fresh, locally sourced ingredients for the perfect taste</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Pizzas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and chef-recommended pizzas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPizzas.length > 0 && featuredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 1995, our family-owned pizzeria has been serving authentic Italian pizzas 
                to our community for over 25 years. We use traditional recipes passed down through 
                generations, combined with the finest local ingredients.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Every pizza is hand-tossed and baked in our wood-fired oven, ensuring that perfect 
                crispy crust and authentic flavor that keeps our customers coming back.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600">25+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-gray-600">Pizza Varieties</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop" 
                alt="Pizza chef preparing dough"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
                <Users className="h-6 w-6 mb-2" />
                <div className="text-sm font-semibold">Family Owned</div>
                <div className="text-xs">Since 1995</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.length > 0 && testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Visit Us Today</h2>
            <p className="text-xl text-gray-600">Come experience the best pizza in town</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                  <p className="text-gray-600">123 Pizza Street, Downtown<br />New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <p className="text-gray-600">(555) 123-PIZZA</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Hours</h4>
                  <p className="text-gray-600">
                    Mon-Thu: 11AM - 10PM<br />
                    Fri-Sat: 11AM - 11PM<br />
                    Sunday: 12PM - 9PM
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Delivery</h3>
              <p className="text-gray-600 mb-6">On orders over $25 within 5 miles</p>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
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