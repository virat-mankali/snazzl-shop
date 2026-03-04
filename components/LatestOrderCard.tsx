'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, X, Check } from 'lucide-react';
import { useConvex } from 'convex/react';

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

interface LatestOrder {
  _id: string;
  orderId: string;
  amount: number;
  items: OrderItem[];
  createdAt: number;
  orderStatus: string;
}

export default function LatestOrderCard() {
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchTime, setFetchTime] = useState<Date | null>(null);
  const convex = useConvex();

  const fetchLatestOrder = useCallback(async () => {
    try {
      // Use convex.query to fetch data once (non-reactive)
      const orders = await convex.query("orders:getAllOrders" as any, {});
      if (orders && orders.length > 0) {
        // Get the most recent order (already sorted desc by createdAt)
        setLatestOrder(orders[0]);
      } else {
        setLatestOrder(null);
      }
      setFetchTime(new Date());
    } catch (error) {
      console.error('Failed to fetch latest order:', error);
      setLatestOrder(null);
    }
  }, [convex]);

  // Fetch on initial load only
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      await fetchLatestOrder();
      setLoading(false);
    };
    loadOrder();
  }, [fetchLatestOrder]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLatestOrder();
    setRefreshing(false);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!latestOrder) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-700">Latest Order</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw 
              size={16} 
              className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        <p className="text-center text-gray-500 py-4">No orders yet</p>
        {fetchTime && (
          <p className="text-xs text-gray-400 text-center">
            Last checked: {fetchTime.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700">Order ID {latestOrder.orderId}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{formatTime(latestOrder.createdAt)}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw 
              size={16} 
              className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {latestOrder.items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.productName} x {item.quantity}</span>
            <span className="font-medium text-black">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {latestOrder.items.length > 3 && (
          <div className="text-xs text-gray-500">
            +{latestOrder.items.length - 3} more item{latestOrder.items.length - 3 > 1 ? 's' : ''}
          </div>
        )}
        <div className="border-t pt-3 flex justify-between font-semibold text-black">
          <span>Total</span>
          <span>₹{latestOrder.amount.toFixed(2)}</span>
        </div>
      </div>

      {latestOrder.orderStatus === 'new' && (
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-black">
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Check size={16} />
            <span>Accept</span>
          </button>
        </div>
      )}

      {latestOrder.orderStatus !== 'new' && (
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            latestOrder.orderStatus === 'accepted' ? 'bg-green-100 text-green-700' :
            latestOrder.orderStatus === 'rejected' ? 'bg-red-100 text-red-700' :
            latestOrder.orderStatus === 'delivered' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {latestOrder.orderStatus.charAt(0).toUpperCase() + latestOrder.orderStatus.slice(1)}
          </span>
        </div>
      )}

      {fetchTime && (
        <p className="text-xs text-gray-400 text-center mt-3">
          Fetched at: {fetchTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
