import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-2 rounded-full">
              <span className="text-xl font-bold">TP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Tony's Pizza</h1>
              <p className="text-xs text-gray-600">Authentic Italian</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Menu
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              (555) 123-PIZZA
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
              <Badge variant="secondary" className="ml-1">0</Badge>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium px-2 py-1">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium px-2 py-1">
                Menu
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium px-2 py-1">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium px-2 py-1">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2 justify-center">
                  <ShoppingCart className="h-4 w-4" />
                  Cart (0)
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};