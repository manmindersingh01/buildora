export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'appetizer' | 'drink' | 'dessert';
  popular?: boolean;
  ingredients?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  size?: 'small' | 'medium' | 'large';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderDate: Date;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}