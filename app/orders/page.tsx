'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OrderCard, { OrderStatus } from '@/components/OrderCard';
import ProfileButton from '@/components/ProfileButton';
import ShopAuthGuard from '@/components/ShopAuthGuard';
import OTPVerificationModal from '@/components/OTPVerificationModal';
import { useQuery, useMutation } from 'convex/react';

type TabType = 'All Orders' | 'placed' | 'confirmed' | 'shipped' | 'delivered';

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Fetch orders from Convex using string-based function name
  const convexOrders = useQuery("orders:getAllOrders" as any) || [];
  
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
  const orders = useMemo(() => {
    return convexOrders.map((order: any) => ({
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
      products: order.items.map((item: any) => ({
        id: item.productId,
        name: item.productName,
        image: item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        color: item.selectedColor,
        size: item.selectedSize.toString(),
        quantity: item.quantity,
        price: item.price
      }))
    }));
  }, [convexOrders]);

  const tabs: { label: TabType; count: number }[] = [
    { label: 'All Orders', count: orders.length },
    { label: 'placed', count: orders.filter((o: any) => o.status === 'New Order').length },
    { label: 'confirmed', count: orders.filter((o: any) => o.status === 'Accepted' || o.status === 'Rejected').length },
    { label: 'shipped', count: orders.filter((o: any) => o.status === 'Delivering' || o.status === 'Assigned').length },
    { label: 'delivered', count: orders.filter((o: any) => o.status === 'Delivered').length }
  ];

  const filteredOrders = orders.filter((order: any) => {
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
  const updateOrderStatus = useMutation("orders:updateOrderStatus" as any);
  const verifyShopOTP = useMutation("orders:verifyShopOTP" as any);

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
      const result = await verifyShopOTP({ orderId: selectedOrderId, otp });
      console.log('Verification result:', result);
      return result;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  return (
    <ShopAuthGuard>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Snazzl Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-semibold text-lg text-black">Snazzl</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-gray-600 pb-4 pt-4 hover:text-gray-900">
                <LayoutDashboard size={18} />
                <span className="font-medium">Overview</span>
              </Link>
              <Link href="/products" className="flex items-center gap-2 text-gray-600 pb-4 pt-4 hover:text-gray-900">
                <Package size={18} />
                <span className="font-medium">Product</span>
              </Link>
              <button className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-4 pt-4">
                <ClipboardList size={18} />
                <span className="font-medium">Orders</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 pb-4 pt-4 hover:text-gray-900 relative group">
                <BarChart2 size={18} />
                <span className="font-medium">Analytics</span>
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Coming Soon
                </span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-black">
              <Bell size={20} />
            </button>
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black mb-2">All Order</h1>
          <p className="text-sm text-gray-600">Check all orders at single place. It's easy to mange.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
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
                className={`pb-3 px-2 font-medium text-sm transition-colors relative ${
                  selectedTab === tab.label
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label === 'All Orders' && '🛒'}
                  {tab.label === 'placed' && '📋'}
                  {tab.label === 'confirmed' && '⚙️'}
                  {tab.label === 'shipped' && '🚚'}
                  {tab.label === 'delivered' && '✓'}
                  {displayLabel} ({tab.count})
                </span>
                {selectedTab === tab.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, name, status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white border border-gray-200 rounded-t-lg px-4 py-3">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
            <div>Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Payment</div>
            <div className="text-center">Status</div>
            <div className="text-right">Action</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-2">
          {convexOrders === undefined ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
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
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No orders found</p>
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
    </ShopAuthGuard>
  );
}
