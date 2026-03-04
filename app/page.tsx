'use client';

import { 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  Users,
  RotateCcw,
  Bell,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import Image from 'next/image';
import NewOrdersSection from '@/components/NewOrdersSection';
import LatestOrderCard from '@/components/LatestOrderCard';
import ProfileButton from '@/components/ProfileButton';
import ShopAuthGuard from '@/components/ShopAuthGuard';

// Sample data for the sales funnel chart
const salesData = [
  { day: '10', value: 42000 },
  { day: '11', value: 48000 },
  { day: '12', value: 62000 },
  { day: '13', value: 45000 },
  { day: '14', value: 52000 },
  { day: '15', value: 48000 },
  { day: '16', value: 83234 },
  { day: '17', value: 45000 },
  { day: '18', value: 68000 },
  { day: '19', value: 72000 },
  { day: '20', value: 58000 },
  { day: '21', value: 62000 },
  { day: '22', value: 58000 },
  { day: '23', value: 62000 },
  { day: '24', value: 58000 },
];

export default function Dashboard() {
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
              <button className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-4 pt-4">
                <LayoutDashboard size={18} />
                <span className="font-medium">Overview</span>
              </button>
              <Link href="/products" className="flex items-center gap-2 text-gray-600 pb-4 pt-4 hover:text-gray-900">
                <Package size={18} />
                <span className="font-medium">Product</span>
              </Link>
              <Link href="/orders" className="flex items-center gap-2 text-gray-600 pb-4 pt-4 hover:text-gray-900">
                <ClipboardList size={18} />
                <span className="font-medium">Orders</span>
              </Link>
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
        {/* Page Title and Controls */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-black">Overview</h1>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black">
              <Calendar size={18} />
              <span>This Month</span>
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-black">Welcome User</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            {/* Revenue */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-700">Revenue</span>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg text-black">₹</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1 text-black">₹83,234</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp size={14} />
                <span>+40%</span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-700">Orders</span>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ClipboardList size={18} className="text-black" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1 text-black">156</div>
              <div className="text-sm text-gray-700">26 july 2025</div>
            </div>

            {/* New customers */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-700">New customers</span>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Users size={18} className="text-black" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1 text-black">186</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp size={14} />
                <span>+20%</span>
              </div>
            </div>

            {/* Refunds */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-700">Refunds</span>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <RotateCcw size={18} className="text-black" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1 text-black">10</div>
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <TrendingDown size={14} />
                <span>+10%</span>
              </div>
            </div>

            {/* Current orders */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-700">Current orders</span>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ShoppingCart size={18} className="text-black" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1 text-black">30</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp size={14} />
                <span>+7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sales Funnel Chart */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-black">Sales Funnel</h3>
                <ChevronRight size={18} className="text-black" />
              </div>
              <button className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg">
                This Month
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      padding: '4px 8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    labelFormatter={() => ''}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Order Card - Fetches on load with refresh button */}
          <LatestOrderCard />
        </div>

        {/* New Orders Section - Live data from Convex */}
        <NewOrdersSection />
      </main>
    </div>
    </ShopAuthGuard>
  );
}
