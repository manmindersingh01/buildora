import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 text-white p-2 rounded-full">
                <span className="text-lg font-bold">TP</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Tony's Pizza Palace</h3>
                <p className="text-sm text-gray-400">Authentic Italian Since 2009</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Serving the finest Italian pizzas with authentic recipes and premium ingredients. 
              Experience the taste of Italy in every bite.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Menu</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Online</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Catering</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Pizza Street, Little Italy, NY 10013</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">(555) 123-PIZZA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@tonyspizza.com</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-gray-400 text-sm">We're Open!</span>
              </div>
              <div className="text-gray-400 text-sm space-y-1">
                <p><span className="text-white">Mon-Thu:</span> 11:00 AM - 10:00 PM</p>
                <p><span className="text-white">Fri-Sat:</span> 11:00 AM - 11:00 PM</p>
                <p><span className="text-white">Sunday:</span> 12:00 PM - 9:00 PM</p>
              </div>
              <div className="mt-3 p-2 bg-green-900/50 rounded border border-green-700">
                <p className="text-green-400 text-xs font-medium">🟢 Currently Open - Order Now!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Tony's Pizza Palace. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};