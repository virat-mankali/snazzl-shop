"use client";

import { useShopAuth } from "../hooks/useShopAuth";
import { ReactNode } from "react";
import Toast from "./Toast";

export default function ShopAuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthorized, showError, setShowError } = useShopAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171719] mx-auto"></div>
          <p className="mt-4 text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {showError && (
          <Toast
            message="You are not eligible to access this interface. Only shop accounts are allowed."
            type="error"
            onClose={() => setShowError(false)}
          />
        )}
        <div className="text-center">
          <p className="text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
