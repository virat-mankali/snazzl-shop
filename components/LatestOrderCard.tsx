'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, X, Check } from 'lucide-react';
import { useConvex } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

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

const getAllOrders = makeFunctionReference<"query">("orders:getAllOrders");

export default function LatestOrderCard() {
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchTime, setFetchTime] = useState<Date | null>(null);
  const convex = useConvex();

  const fetchLatestOrder = useCallback(async () => {
    try {
      // Use convex.query to fetch data once (non-reactive)
      const orders = (await convex.query(getAllOrders, {})) as
        | LatestOrder[]
        | undefined;
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (!latestOrder) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">Latest Order</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={`text-slate-500 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        <p className="text-center text-slate-500 py-4">No orders yet</p>
        {fetchTime && (
          <p className="text-xs text-slate-400 text-center">
            Last checked: {fetchTime.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">Order ID {latestOrder.orderId}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{formatTime(latestOrder.createdAt)}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={`text-slate-500 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {latestOrder.items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-slate-700">{item.productName} x {item.quantity}</span>
            <span className="font-medium text-[#171719]">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {latestOrder.items.length > 3 && (
          <div className="text-xs text-slate-500">
            +{latestOrder.items.length - 3} more item{latestOrder.items.length - 3 > 1 ? 's' : ''}
          </div>
        )}
        <div className="border-t pt-3 flex justify-between font-semibold text-[#171719]">
          <span>Total</span>
          <span>₹{latestOrder.amount.toFixed(2)}</span>
        </div>
      </div>

      {latestOrder.orderStatus === 'new' && (
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[#171719]">
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171719] text-white rounded-lg hover:bg-[#2A2A2D]">
            <Check size={16} />
            <span>Accept</span>
          </button>
        </div>
      )}

      {latestOrder.orderStatus !== 'new' && (
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            latestOrder.orderStatus === 'accepted' ? 'bg-[#EDF2E8] text-[#5C7251]' :
            latestOrder.orderStatus === 'rejected' ? 'bg-[#F7E4E4] text-[#C86565]' :
            latestOrder.orderStatus === 'delivered' ? 'bg-[#F8EEE8] text-[#8A5D46]' :
            'bg-slate-100 text-slate-700'
          }`}>
            {latestOrder.orderStatus.charAt(0).toUpperCase() + latestOrder.orderStatus.slice(1)}
          </span>
        </div>
      )}

      {fetchTime && (
        <p className="text-xs text-slate-400 text-center mt-3">
          Fetched at: {fetchTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
