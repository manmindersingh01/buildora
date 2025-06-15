import React from 'react';
import { Pizza, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-full">
                <Pizza className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Mario's Pizzeria</span>
            </div>
            <p className="text-gray-400 mb-4">
              Serving authentic Italian pizzas since 1985. Made with love and the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <div className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 cursor-pointer transition-colors">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 cursor-pointer transition-colors">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 cursor-pointer transition-colors">
                <Instagram className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#menu" className="text-gray-400 hover:text-white transition-colors">Our Menu</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Online</a></li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Our Menu</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Classic Pizzas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Specialty Pizzas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Appetizers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Beverages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Desserts</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-gray-400">123 Pizza Street<br />Food District, City 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-gray-400">(555) 123-PIZZA</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-gray-400">info@mariospizza.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-gray-400">Daily: 11:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Mario's Pizzeria. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};