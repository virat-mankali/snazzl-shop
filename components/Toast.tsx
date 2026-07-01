"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "error", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    error: "bg-[#F7E4E4] border-[#F0D1D1] text-[#C86565]",
    success: "bg-[#EDF2E8] border-[#DDE5D6] text-[#5C7251]",
    info: "bg-[#F8EEE8] border-[#DDE5D6] text-[#5C7251]",
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`${bgColor} border rounded-lg shadow-lg p-4 pr-10 max-w-md`}>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-current opacity-70 hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
