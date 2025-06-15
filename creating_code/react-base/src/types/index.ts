export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'classic' | 'premium' | 'specialty';
  sizes: Size[];
  toppings?: string[];
}

export interface Size {
  name: string;
  price: number;
  multiplier: number;
}

export interface CartItem {
  id: string;
  pizza: Pizza;
  size: Size;
  quantity: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderDate: string;
  deliveryTime: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  pizzaName: string;
}