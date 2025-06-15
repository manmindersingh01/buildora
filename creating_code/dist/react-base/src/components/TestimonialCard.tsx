import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Review } from '@/types';

interface TestimonialCardProps {
  review: Review;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {renderStars(review.rating)}
        </div>
        <p className="text-gray-700 mb-4 italic">
          "{review.comment}"
        </p>
        <div className="border-t pt-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-semibold text-sm">
                {review.customerName.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{review.customerName}</h4>
              <p className="text-sm text-gray-500">
                {review.date.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};