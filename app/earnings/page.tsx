"use client";

import { useEffect, useState } from "react";
import { useConvexAuth, usePaginatedQuery } from "convex/react";
import { makeFunctionReference, type PaginationOptions } from "convex/server";
import ShopAuthGuard from "@/components/ShopAuthGuard";
import ShopSidebar from "@/components/ShopSidebar";
import ShopTopbar from "@/components/ShopTopbar";
import EarningsDashboard from "@/components/EarningsDashboard";
import {
  periodRange,
  type EarningsOrder,
  type EarningsPeriod,
} from "@/lib/earnings";

const earningsQuery = makeFunctionReference<
  "query",
  { start: number; end: number; paginationOpts: PaginationOptions },
  { page: EarningsOrder[]; isDone: boolean; continueCursor: string }
>("partnerEarnings:list");

function EarningsContent() {
  const { isAuthenticated } = useConvexAuth();
  const [period, setPeriod] = useState<EarningsPeriod>("month");
  const [now, setNow] = useState(() => Date.now());
  const { start, end } = periodRange(period, now);
  const { results, status, loadMore } = usePaginatedQuery(
    earningsQuery,
    isAuthenticated ? { start, end } : "skip",
    { initialNumItems: 200 },
  );
  useEffect(() => {
    if (status === "CanLoadMore") loadMore(200);
  }, [status, loadMore]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <ShopSidebar activeItem="earnings" />
      <div className="min-w-0 flex-1">
        <ShopTopbar
          title="Earnings"
          description="A clear view of your store’s sales."
        >
          <span className="hidden text-xs text-neutral-500 lg:inline">
            Partner workspace
          </span>
        </ShopTopbar>
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 pt-6 sm:px-7">
          <span className="text-sm font-medium text-neutral-600">
            Performance overview
          </span>
          <div
            className="inline-flex flex-wrap gap-1 rounded-xl border border-neutral-200 bg-white p-1"
            aria-label="Earnings period"
          >
            {(
              [
                ["month", "This month"],
                ["lastMonth", "Last month"],
                ["90days", "Last 90 days"],
              ] as const
            ).map(([id, label]) => (
              <button
                type="button"
                key={id}
                aria-pressed={period === id}
                onClick={() => {
                  setPeriod(id);
                  setNow(Date.now());
                }}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${period === id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <EarningsDashboard
          key={period}
          orders={results}
          start={start}
          end={end}
          loading={status !== "Exhausted"}
        />
      </div>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <ShopAuthGuard>
      <EarningsContent />
    </ShopAuthGuard>
  );
}
