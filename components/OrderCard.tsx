'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type OrderStatus = 'New Order' | 'Started' | 'Accepted' | 'Rejected' | 'Assigned' | 'Picked' | 'Delivering' | 'Delivered';

export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  orderDate: string;
  products: OrderProduct[];
  paymentMethod: string;
  status: OrderStatus;
  amount: number;
  deliveryNote?: string;
}

interface OrderCardProps {
  order: Order;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onPrintLabel?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onInvoice?: (orderId: string) => void;
  onHandToAgent?: (orderId: string) => void;
}

export default function OrderCard({ 
  order, 
  onAccept, 
  onReject,
  onPrintLabel,
  onCancelOrder,
  onInvoice,
  onHandToAgent
}: OrderCardProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedProducts = showAll ? order.products : order.products.slice(0, 1);
  const hasMoreProducts = order.products.length > 1;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New Order':
        return 'bg-orange-100 text-orange-600';
      case 'Started':
        return 'bg-yellow-100 text-yellow-600';
      case 'Accepted':
        return 'bg-green-100 text-green-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      case 'Assigned':
        return 'bg-purple-100 text-purple-600';
      case 'Picked':
        return 'bg-indigo-100 text-indigo-600';
      case 'Delivering':
        return 'bg-blue-100 text-blue-600';
      case 'Delivered':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderActions = () => {
    switch (order.status) {
      case 'New Order':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onReject?.(order.orderId)}
              className="px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium"
            >
              Reject Order
            </button>
            <button
              onClick={() => onAccept?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Accept Order
            </button>
          </div>
        );
      case 'Started':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onHandToAgent?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm font-medium"
            >
              <span>🤝</span>
              Hand to Delivery Agent
            </button>
          </div>
        );
      case 'Accepted':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm"
            >
              <span>📄</span>
              Print Label
            </button>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 px-3 py-1.5">Order Rejected</span>
          </div>
        );
      case 'Assigned':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm"
            >
              <span>📄</span>
              Print Label
            </button>
          </div>
        );
      case 'Picked':
        return (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 px-3 py-1.5">Order picked by delivery agent</span>
          </div>
        );
      case 'Delivering':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm"
            >
              <span>📄</span>
              Print Label
            </button>
          </div>
        );
      case 'Delivered':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onInvoice?.(order.orderId)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm"
            >
              <span>📋</span>
              Invoice
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Order Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-600">Customer: </span>
            <span className="text-black font-medium">{order.customerName}</span>
          </div>
          <div>
            <span className="text-gray-600">Date of Order </span>
            <span className="text-black font-medium">{order.orderDate}</span>
          </div>
        </div>
        <div>
          <span className="text-gray-600 text-sm">Order ID: </span>
          <span className="text-black font-medium">{order.orderId}</span>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {displayedProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-100"
            />
            <div className="flex-1 grid grid-cols-5 gap-4">
              <div>
                <div className="font-medium text-black">{product.name}</div>
                <div className="text-sm text-gray-600">
                  Color: {product.color} Size: {product.size}
                </div>
                <div className="text-sm text-gray-600">Quantity: {product.quantity}</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-black">
                  {index === 0 ? `₹${order.amount.toFixed(2)}` : '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">{index === 0 ? order.paymentMethod : '-'}</div>
              </div>
              <div className="text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                {order.deliveryNote && (
                  <div className="text-xs text-gray-600 mt-1">{order.deliveryNote}</div>
                )}
              </div>
              <div className="flex justify-end">
                {index === 0 && renderActions()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreProducts && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mt-3 font-medium"
        >
          {showAll ? (
            <>
              Show less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Show more <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
