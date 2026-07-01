'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import OrderCard, { Order, OrderStatus } from '@/components/OrderCard';
import ShopAuthGuard from '@/components/ShopAuthGuard';
import OTPVerificationModal from '@/components/OTPVerificationModal';
import ShopSidebar from '@/components/ShopSidebar';
import ShopTopbar from '@/components/ShopTopbar';
import { useQuery, useMutation } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

type TabType = 'All Orders' | 'placed' | 'confirmed' | 'shipped' | 'delivered';

type ConvexOrderItem = {
  productId: string;
  productName: string;
  productImage?: string;
  selectedColor: string;
  selectedSize?: number | string;
  quantity: number;
  price: number;
};

type ConvexOrderRecord = {
  _id: string;
  orderId: string;
  customerName: string;
  createdAt: number;
  paymentMethod: string;
  orderStatus: string;
  amount: number;
  items: ConvexOrderItem[];
  otp?: {
    shop?: string;
    customer?: string;
  };
};

type VerifyResult = {
  success: boolean;
  message: string;
};

const getAllOrders = makeFunctionReference<"query">("orders:getAllOrders");
const updateOrderStatusMutation = makeFunctionReference<"mutation">(
  "orders:updateOrderStatus"
);
const verifyShopOTPMutation = makeFunctionReference<"mutation">(
  "orders:verifyShopOTP"
);

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Fetch orders from Convex using string-based function name
  const queriedConvexOrders = useQuery(getAllOrders) as
    | ConvexOrderRecord[]
    | undefined;
  const convexOrders = useMemo(
    () => queriedConvexOrders ?? [],
    [queriedConvexOrders]
  );
  
  // Debug: Log orders to see OTP structure
  React.useEffect(() => {
    if (convexOrders.length > 0) {
      console.log('Sample order with OTP:', {
        orderId: convexOrders[0].orderId,
        shopOTP: convexOrders[0].otp?.shop,
        customerOTP: convexOrders[0].otp?.customer,
        status: convexOrders[0].orderStatus,
      });
    }
  }, [convexOrders]);

  // Map Convex status to display status
  const getDisplayStatus = (status: string): OrderStatus => {
    switch (status) {
      case 'new':
        return 'New Order';
      case 'started':
        return 'Started';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'assigned':
        return 'Assigned';
      case 'picked':
        return 'Picked';
      case 'delivering':
        return 'Delivering';
      case 'delivered':
        return 'Delivered';
      default:
        return 'New Order';
    }
  };

  // Transform Convex orders to OrderCard format
  const orders = useMemo<Order[]>(() => {
    return convexOrders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      customerName: order.customerName,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      paymentMethod: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      status: getDisplayStatus(order.orderStatus),
      amount: order.amount,
      products: order.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        image: item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        color: item.selectedColor,
        size: String(item.selectedSize ?? ''),
        quantity: item.quantity,
        price: item.price
      }))
    }));
  }, [convexOrders]);

  const tabs: { label: TabType; count: number }[] = [
    { label: 'All Orders', count: orders.length },
    { label: 'placed', count: orders.filter((o) => o.status === 'New Order').length },
    { label: 'confirmed', count: orders.filter((o) => o.status === 'Accepted' || o.status === 'Rejected').length },
    { label: 'shipped', count: orders.filter((o) => o.status === 'Delivering' || o.status === 'Assigned').length },
    { label: 'delivered', count: orders.filter((o) => o.status === 'Delivered').length }
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = selectedTab === 'All Orders' ||
      (selectedTab === 'placed' && order.status === 'New Order') ||
      (selectedTab === 'confirmed' && (order.status === 'Accepted' || order.status === 'Rejected')) ||
      (selectedTab === 'shipped' && (order.status === 'Delivering' || order.status === 'Assigned')) ||
      (selectedTab === 'delivered' && order.status === 'Delivered');

    const matchesSearch = searchQuery === '' ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Mutation to update order status using string-based function name
  const updateOrderStatus = useMutation(updateOrderStatusMutation);
  const verifyShopOTP = useMutation(verifyShopOTPMutation);

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

  const handlePrintLabel = (orderId: string) => {
    console.log('Print label:', orderId);
    // TODO: Implement print label logic
    window.print();
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus({ orderId, status: 'rejected' });
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleInvoice = (orderId: string) => {
    console.log('Generate invoice:', orderId);
    // TODO: Implement invoice generation logic
  };

  const handleHandToAgent = (orderId: string) => {
    console.log('Opening OTP modal for order:', orderId);
    setSelectedOrderId(orderId);
    setOtpModalOpen(true);
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      console.log('Verifying OTP:', { orderId: selectedOrderId, otp });
      const result = (await verifyShopOTP({
        orderId: selectedOrderId,
        otp,
      })) as VerifyResult;
      console.log('Verification result:', result);
      return result;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  return (
    <ShopAuthGuard>
    <div className="flex min-h-screen bg-[#F1F1F1]">
      <ShopSidebar activeItem="orders" />
      <div className="min-w-0 flex-1">
      <ShopTopbar title="Orders" description="Accept, reject and hand over active customer orders.">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, name, status"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-72 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#D4A373] focus:bg-white focus:ring-3 focus:ring-[#F3E7D7]"
          />
        </div>
      </ShopTopbar>

      {/* Main Content */}
      <main className="p-6">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => {
            const displayLabel = tab.label === 'All Orders' ? 'All Orders' :
              tab.label === 'placed' ? 'New Orders' :
              tab.label === 'confirmed' ? 'Processed' :
              tab.label === 'shipped' ? 'In Transit' :
              'Delivered';
            
            return (
              <button
                key={tab.label}
                onClick={() => setSelectedTab(tab.label)}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedTab === tab.label
                    ? 'bg-[#171719] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#171719]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {displayLabel} ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Header */}
        <div className="rounded-t-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="grid grid-cols-5 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div>Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Payment</div>
            <div className="text-center">Status</div>
            <div className="text-right">Action</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-2">
          {queriedConvexOrders === undefined ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onPrintLabel={handlePrintLabel}
                onCancelOrder={handleCancelOrder}
                onInvoice={handleInvoice}
                onHandToAgent={handleHandToAgent}
              />
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">No orders found</p>
            </div>
          )}
        </div>
      </main>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        orderId={selectedOrderId}
        onVerify={handleVerifyOTP}
      />
      </div>
    </div>
    </ShopAuthGuard>
  );
}
