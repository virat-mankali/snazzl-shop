import { Order } from '@/components/OrderCard';

// Shared order data across the application
export const sampleOrders: Order[] = [
  {
    id: '1',
    orderId: '246522114',
    customerName: 'Danial Donald',
    orderDate: '26 Jan, 2023',
    paymentMethod: 'Credit card',
    status: 'New Order',
    deliveryNote: 'Please process before 22 Mar, 24',
    products: [
      {
        id: 'p1',
        name: 'Nike Air Jordan Reflex',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        color: 'Black',
        size: '23',
        quantity: 2,
        price: 26.35
      }
    ]
  },
  {
    id: '2',
    orderId: '246522115',
    customerName: 'Sarah Johnson',
    orderDate: '26 Jan, 2023',
    paymentMethod: 'Credit card',
    status: 'Accepted',
    deliveryNote: 'Please Ship before 22 Mar, 24',
    products: [
      {
        id: 'p2',
        name: '2.5wt Black Table Lamp',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
        color: 'Black',
        size: '23',
        quantity: 2,
        price: 26.35
      },
      {
        id: 'p3',
        name: 'Nike Air Jordan Reflex',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        color: 'Black',
        size: '32',
        quantity: 2,
        price: 26.35
      },
      {
        id: 'p4',
        name: 'Paoul Hewitt Limited Edition',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        color: 'Black',
        size: 'Large',
        quantity: 2,
        price: 26.35
      }
    ]
  },
  {
    id: '3',
    orderId: '246522116',
    customerName: 'Michael Chen',
    orderDate: '26 Jan, 2023',
    paymentMethod: 'Credit card',
    status: 'Delivering',
    deliveryNote: 'Please process before 22 Mar, 24',
    products: [
      {
        id: 'p5',
        name: 'Haylou Solar RS2',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        color: 'Black',
        size: '23',
        quantity: 2,
        price: 26.35
      }
    ]
  },
  {
    id: '4',
    orderId: '246522117',
    customerName: 'Emma Wilson',
    orderDate: '26 Jan, 2023',
    paymentMethod: 'Credit card',
    status: 'Delivered',
    deliveryNote: 'Estimated Delivery by 22 Mar, 24',
    products: [
      {
        id: 'p6',
        name: 'Nike Air Jordan Reflex',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        color: 'Black',
        size: '23',
        quantity: 2,
        price: 26.35
      }
    ]
  },
  {
    id: '5',
    orderId: '246522118',
    customerName: 'John Smith',
    orderDate: '27 Jan, 2023',
    paymentMethod: 'UPI',
    status: 'New Order',
    deliveryNote: 'Please process before 25 Mar, 24',
    products: [
      {
        id: 'p7',
        name: 'Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        color: 'White',
        size: 'One Size',
        quantity: 1,
        price: 89.99
      },
      {
        id: 'p8',
        name: 'Phone Case',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        color: 'Blue',
        size: 'Medium',
        quantity: 3,
        price: 15.50
      }
    ]
  }
];
