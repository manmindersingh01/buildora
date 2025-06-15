import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Pizza, ShoppingCart } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-full">
              <Pizza className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Mario's Pizzeria
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Home
            </a>
            <a href="#menu" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Menu
            </a>
            <a href="#about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Contact
            </a>
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Online
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                Home
              </a>
              <a href="#menu" className="text-gray-700 hover:text-red-600 font-medium">
                Menu
              </a>
              <a href="#about" className="text-gray-700 hover:text-red-600 font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 font-medium">
                Contact
              </a>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Order Online
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};