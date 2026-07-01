'use client';

import { 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  Users,
  RotateCcw,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NewOrdersSection from '@/components/NewOrdersSection';
import LatestOrderCard from '@/components/LatestOrderCard';
import ShopAuthGuard from '@/components/ShopAuthGuard';
import ShopSidebar from '@/components/ShopSidebar';
import ShopTopbar from '@/components/ShopTopbar';

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
    <div className="flex min-h-screen bg-[#F1F1F1]">
      <ShopSidebar activeItem="overview" />
      <div className="min-w-0 flex-1">
      <ShopTopbar
        title="Overview"
        description="Your live shop performance, orders and sales movement."
      >
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#D4A373] focus:bg-white focus:ring-3 focus:ring-[#F3E7D7]"
          />
        </div>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
          <Calendar size={16} />
          <span>This Month</span>
        </button>
      </ShopTopbar>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold text-[#171719]">Today&apos;s command center</h2><p className="mt-1 text-sm text-slate-500">A quick scan of revenue, current orders and customer movement.</p></div><span className="rounded-full bg-[#EDF2E8] px-3 py-1 text-xs font-medium text-[#5C7251] ring-1 ring-[#DDE5D6]">Store online</span></div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-3">
            {/* Revenue */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <span className="text-lg text-black">₹</span>
                </div>
              </div>
              <div className="text-2xl font-semibold mb-1 text-[#171719]">₹83,234</div>
              <div className="flex items-center gap-1 text-[#5C7251] text-xs font-medium">
                <TrendingUp size={14} />
                <span>+40%</span>
              </div>
            </div>

            {/* Orders */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Orders</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <ClipboardList size={18} className="text-slate-700" />
                </div>
              </div>
              <div className="text-2xl font-semibold mb-1 text-[#171719]">156</div>
              <div className="text-xs text-slate-500">26 July 2025</div>
            </div>

            {/* New customers */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">New customers</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <Users size={18} className="text-slate-700" />
                </div>
              </div>
              <div className="text-2xl font-semibold mb-1 text-[#171719]">186</div>
              <div className="flex items-center gap-1 text-[#5C7251] text-xs font-medium">
                <TrendingUp size={14} />
                <span>+20%</span>
              </div>
            </div>

            {/* Refunds */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Refunds</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <RotateCcw size={18} className="text-slate-700" />
                </div>
              </div>
              <div className="text-2xl font-semibold mb-1 text-[#171719]">10</div>
              <div className="flex items-center gap-1 text-[#C86565] text-xs font-medium">
                <TrendingDown size={14} />
                <span>+10%</span>
              </div>
            </div>

            {/* Current orders */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Current orders</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <ShoppingCart size={18} className="text-slate-700" />
                </div>
              </div>
              <div className="text-2xl font-semibold mb-1 text-[#171719]">30</div>
              <div className="flex items-center gap-1 text-[#5C7251] text-xs font-medium">
                <TrendingUp size={14} />
                <span>+7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sales Funnel Chart */}
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#171719]">Sales Funnel</h3>
                <ChevronRight size={17} className="text-slate-400" />
              </div>
              <button className="rounded-lg bg-[#F8EEE8] px-3 py-1.5 text-xs font-medium text-[#8A5D46]">
                This Month
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E0DD" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#B76743',
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
                    stroke="#B76743"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#B76743' }}
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
    </div>
    </ShopAuthGuard>
  );
}
