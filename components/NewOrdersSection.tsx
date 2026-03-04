'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { useMemo } from 'react';

interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  selectedSize: number;
  selectedColor: string;
  price: number;
  productImage?: string;
}

interface ConvexOrder {
  _id: string;
  orderId: string;
  customerName: string;
  amount: number;
  items: OrderItem[];
  createdAt: number;
  orderStatus: string;
  paymentMethod: string;
}

export default function NewOrdersSection() {
  // Fetch orders from Convex
  const convexOrders = useQuery("orders:getAllOrders" as any) || [];
  const updateOrderStatus = useMutation("orders:updateOrderStatus" as any);

  // Filter only new orders
  const newOrders = useMemo(() => {
    return convexOrders.filter((order: ConvexOrder) => order.orderStatus === 'new');
  }, [convexOrders]);

  const handleAccept = async (orderId: string) => {
    try {
      await updateOrderStatus({ orderId, status: 'accepted' });
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await updateOrderStatus({ orderId, status: 'rejected' });
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (convexOrders === undefined) {
    return (
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-black">New Orders</h3>
            <ChevronRight size={18} className="text-black" />
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (newOrders.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-black">New Orders</h3>
            <ChevronRight size={18} className="text-black" />
          </div>
          <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <p className="text-center text-gray-600 py-8">No new orders at the moment</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-black">New Orders</h3>
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
            {newOrders.length}
          </span>
        </div>
        <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Orders →
        </Link>
      </div>

      <div className="space-y-4">
        {newOrders.map((order: ConvexOrder, index: number) => (
          <div 
            key={order._id} 
            className={`${index !== newOrders.length - 1 ? 'border-b pb-4' : ''}`}
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-black">{order.customerName}</div>
                  <div className="text-xs text-gray-600">Order #{order.orderId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                <div className="text-xs text-gray-500">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-2 mb-3">
              {order.items.slice(0, 2).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-black">{item.productName}</div>
                    <div className="text-xs text-gray-600">
                      {item.selectedColor} • Size {item.selectedSize} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-black">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs text-gray-600 pl-3">
                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Total and Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Total: </span>
                <span className="font-semibold text-black">
                  ₹{order.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleReject(order.orderId)}
                  className="px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAccept(order.orderId)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
