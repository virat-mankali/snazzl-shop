'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus,
  Package,
  Calendar,
  X
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';
import ShopAuthGuard from '@/components/ShopAuthGuard';
import ShopSidebar from '@/components/ShopSidebar';
import ShopTopbar from '@/components/ShopTopbar';
import { useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';
import { productCategories } from '@/lib/productCategories';

const categories = [
  'All Products',
  ...productCategories.map((category) => category.label),
];

const timeFilters = [
  { label: 'Past 14 days', value: '14' },
  { label: 'Past 28 days', value: '28' },
  { label: 'Past 90 days', value: '90' },
  { label: 'Past 365 days', value: '365' }
];

type ProductRecord = {
  _id: string;
  product_name: string;
  product_images?: {
    cover_image?: string;
  };
  category?: {
    main_category?: string;
    sub_category?: string;
    sub_sub_category?: string;
  };
  price: {
    base_price: number;
    discount: number;
  };
  stock?: number;
};

const getCurrentBrandStoreProducts = makeFunctionReference<"query">(
  "products:getCurrentBrandStoreProducts"
);

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Last week');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch current user's products from Convex
  const queriedProducts = useQuery(getCurrentBrandStoreProducts) as
    | ProductRecord[]
    | undefined;
  const products = queriedProducts ?? [];
  const visibleProducts =
    selectedCategory === 'All Products'
      ? products
      : products.filter(
          (product) => product.category?.main_category === selectedCategory
        );

  const handleProductAdded = () => {
    setShowAddModal(false);
  };

  return (
    <ShopAuthGuard>
    <div className="flex min-h-screen bg-[#F1F1F1]">
      <ShopSidebar activeItem="products" />
      <div className="min-w-0 flex-1">
      <ShopTopbar title="Products" description="Manage inventory, pricing and availability.">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search products"
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#D4A373] focus:bg-white focus:ring-3 focus:ring-[#F3E7D7]"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#171719] px-4 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#2A2A2D]"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </ShopTopbar>

      {/* Main Content */}
      <main className="p-6">
        {/* Filters */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#171719] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#171719]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2">
            <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <span className="text-sm">Out Of Stock</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowTimeFilter(!showTimeFilter)}
                className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Calendar size={16} />
                <span className="text-sm">{selectedTimeFilter}</span>
              </button>

              {showTimeFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-black">Select Time Period</span>
                    <button onClick={() => setShowTimeFilter(false)} className="text-slate-500 hover:text-black">
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
                          className="w-4 h-4 text-[#171719]"
                        />
                        <span className="text-sm text-slate-700">{filter.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button 
                      onClick={() => setShowTimeFilter(false)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-black text-sm"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTimeFilter('Past 14 days');
                        setShowTimeFilter(false);
                      }}
                      className="flex-1 px-4 py-2 bg-[#171719] text-white rounded-lg hover:bg-[#2A2A2D] text-sm"
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
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <Package size={28} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No products yet</h3>
            <p className="text-sm text-slate-500 mb-6">
              {selectedCategory === 'All Products'
                ? 'Start by adding your first product'
                : `No products in ${selectedCategory} yet`}
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#171719] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#2A2A2D]"
            >
              <Plus size={18} />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 xl:grid-cols-5">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.product_name}
                image={product.product_images?.cover_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'}
                price={product.price.base_price}
                salePrice={product.price.discount > 0 ? Math.round(product.price.base_price * (1 - product.price.discount / 100)) : null}
                stock={product.stock || 0}
                sold={0}
                categoryPath={[
                  product.category?.main_category,
                  product.category?.sub_category,
                  product.category?.sub_sub_category,
                ]
                  .filter(Boolean)
                  .join(' / ')}
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
    </div>
    </ShopAuthGuard>
  );
}
