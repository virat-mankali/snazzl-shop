'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus,
  Bell,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart2,
  Calendar,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';
import ProfileButton from '@/components/ProfileButton';
import ShopAuthGuard from '@/components/ShopAuthGuard';
import { useQuery } from 'convex/react';

const categories = [
  'All Products',
  'Most Purchased',
  'Cloths',
  'Shoes',
  'Electronics',
  'Beauty',
  'Fashion',
  'Appliances'
];

const timeFilters = [
  { label: 'Past 14 days', value: '14' },
  { label: 'Past 28 days', value: '28' },
  { label: 'Past 90 days', value: '90' },
  { label: 'Past 365 days', value: '365' }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Last week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch current user's products from Convex
  const products = useQuery("products:getCurrentBrandStoreProducts" as any) || [];

  const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1);
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
              <button className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-4 pt-4">
                <Package size={18} />
                <span className="font-medium">Product</span>
              </button>
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
          <h1 className="text-2xl font-semibold text-black">Products</h1>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-400"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black bg-white">
              <span className="text-sm">Out Of Stock</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowTimeFilter(!showTimeFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black bg-white"
              >
                <Calendar size={18} />
                <span className="text-sm">{selectedTimeFilter}</span>
              </button>

              {showTimeFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-black">Select Time Period</span>
                    <button onClick={() => setShowTimeFilter(false)} className="text-gray-500 hover:text-black">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {timeFilters.map((filter) => (
                      <label key={filter.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="timeFilter"
                          value={filter.value}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{filter.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button 
                      onClick={() => setShowTimeFilter(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black text-sm"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTimeFilter('Past 14 days');
                        setShowTimeFilter(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Show Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first product</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={20} />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                id={product._id}
                name={product.product_name}
                image={product.product_images?.cover_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'}
                price={product.price.base_price}
                salePrice={product.price.discount > 0 ? Math.round(product.price.base_price * (1 - product.price.discount / 100)) : null}
                stock={product.stock || 0}
                sold={0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={handleProductAdded}
      />
    </div>
    </ShopAuthGuard>
  );
}
