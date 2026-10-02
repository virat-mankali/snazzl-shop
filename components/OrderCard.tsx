'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Handshake, ReceiptText } from 'lucide-react';

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
        return 'bg-[#F5F5F5] text-[#404040] ring-1 ring-[#E5E5E5]';
      case 'Started':
        return 'bg-[#F5F5F5] text-[#404040] ring-1 ring-[#E5E5E5]';
      case 'Accepted':
        return 'bg-[#EDF2E8] text-[#5C7251] ring-1 ring-[#DDE5D6]';
      case 'Rejected':
        return 'bg-[#F7E4E4] text-[#C86565] ring-1 ring-[#F0D1D1]';
      case 'Assigned':
        return 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200';
      case 'Picked':
        return 'bg-[#EDF2E8] text-[#5C7251] ring-1 ring-[#DDE5D6]';
      case 'Delivering':
        return 'bg-[#F5F5F5] text-[#404040] ring-1 ring-[#E5E5E5]';
      case 'Delivered':
        return 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200';
    }
  };

  const renderActions = () => {
    switch (order.status) {
      case 'New Order':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onReject?.(order.orderId)}
              className="rounded-lg border border-[#F0D1D1] px-3 py-1.5 text-sm font-medium text-[#C86565] transition hover:bg-[#F7E4E4]"
            >
              Reject Order
            </button>
            <button
              onClick={() => onAccept?.(order.orderId)}
              className="rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
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
              className="flex items-center gap-1.5 rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
            >
              <Handshake size={15} />
              Hand to Delivery Agent
            </button>
          </div>
        );
      case 'Accepted':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="flex items-center gap-1.5 rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
            >
              <FileText size={15} />
              Print Label
            </button>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex gap-2">
            <span className="text-sm text-neutral-500 px-3 py-1.5">Order Rejected</span>
          </div>
        );
      case 'Assigned':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="flex items-center gap-1.5 rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
            >
              <FileText size={15} />
              Print Label
            </button>
          </div>
        );
      case 'Picked':
        return (
          <div className="flex gap-2">
            <span className="text-sm text-neutral-500 px-3 py-1.5">Order picked by delivery agent</span>
          </div>
        );
      case 'Delivering':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onPrintLabel?.(order.orderId)}
              className="flex items-center gap-1.5 rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
            >
              <FileText size={15} />
              Print Label
            </button>
          </div>
        );
      case 'Delivered':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onCancelOrder?.(order.orderId)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onInvoice?.(order.orderId)}
              className="flex items-center gap-1.5 rounded-lg bg-[#171717] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/10 transition hover:bg-[#404040]"
            >
              <ReceiptText size={15} />
              Invoice
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300">
      {/* Order Header */}
      <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-neutral-500">Customer: </span>
            <span className="font-semibold text-[#171717]">{order.customerName}</span>
          </div>
          <div>
            <span className="text-neutral-500">Date of Order </span>
            <span className="font-medium text-neutral-700">{order.orderDate}</span>
          </div>
        </div>
        <div>
          <span className="text-sm text-neutral-500">Order ID: </span>
          <span className="font-semibold text-[#171717]">{order.orderId}</span>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {displayedProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-14 w-14 rounded-lg bg-neutral-100 object-cover"
            />
            <div className="flex-1 grid grid-cols-5 gap-4">
              <div>
                <div className="font-semibold text-[#171717]">{product.name}</div>
                <div className="text-sm text-neutral-500">
                  Color: {product.color} Size: {product.size}
                </div>
                <div className="text-sm text-neutral-500">Quantity: {product.quantity}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-[#171717]">
                  {index === 0 ? `₹${order.amount.toFixed(2)}` : '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500">{index === 0 ? order.paymentMethod : '-'}</div>
              </div>
              <div className="text-center">
                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                {order.deliveryNote && (
                  <div className="text-xs text-neutral-500 mt-1">{order.deliveryNote}</div>
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
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black mt-3 font-medium"
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
