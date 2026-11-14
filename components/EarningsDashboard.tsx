"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  dateLabel,
  money,
  orderGroup,
  summarizeEarnings,
  type EarningsOrder,
} from "@/lib/earnings";

type Props = {
  orders: EarningsOrder[];
  start: number;
  end: number;
  loading: boolean;
};

export default function EarningsDashboard({
  orders,
  start,
  end,
  loading,
}: Props) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const summary = summarizeEarnings(orders, start, end);
  const filtered = orders.filter(
    (order) =>
      (filter === "all" || orderGroup(order.status) === filter) &&
      order.id.toLowerCase().includes(search.toLowerCase().trim()),
  );
  const lastPage = Math.max(0, Math.ceil(filtered.length / 10) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = filtered.slice(currentPage * 10, currentPage * 10 + 10);
  const period = `${dateLabel(start)} – ${dateLabel(end - 1)}`;
  const value = (amount: number) => (loading ? "—" : money(amount));

  function exportOrders() {
    const rows = [
      [
        "Order",
        "Placed (IST)",
        "Status",
        "Payment",
        "Units",
        "Product sales (INR)",
        "Included in gross earnings",
      ],
      ...filtered.map((order) => [
        order.id,
        new Date(order.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        order.status,
        order.paymentMethod,
        String(order.units),
        (order.salesPaise / 100).toFixed(2),
        orderGroup(order.status) === "delivered" ? "Yes" : "No",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${(/^[=+@\-\t\r]/.test(cell) ? "'" : "") + cell.replaceAll('"', '""')}"`,
          )
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `snazzl-earnings-${new Date(start + 330 * 60000).toISOString().slice(0, 10)}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main
      className="mx-auto max-w-[1440px] space-y-6 p-4 text-neutral-900 sm:p-7"
      aria-busy={loading}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Your business, at a glance
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Every order. A clearer picture.
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            See what your store has earned and what&apos;s on its way.
          </p>
        </div>
        <span className="flex items-center gap-2 text-xs text-neutral-600">
          <span
            className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-500" : "bg-emerald-600"}`}
          />
          {loading ? "Calculating your earnings…" : "Updates automatically"}
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <section className="relative overflow-hidden rounded-2xl bg-[#183d32] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[44px] border-white/[0.04]" />
          <div className="relative flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-100">
              <Wallet size={18} />
              Gross earnings
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-emerald-50">
              {period}
            </span>
          </div>
          <div className="relative mt-7 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
            {value(summary.earned)}
          </div>
          <p className="mt-3 text-sm text-emerald-100">
            Product sales from delivered orders
          </p>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/20 pt-5 text-sm">
            <span className="flex items-center gap-2">
              <Check size={16} className="text-emerald-200" />
              {loading ? "—" : summary.delivered} delivered orders
            </span>
            <span className="text-emerald-100">
              {loading ? "—" : summary.units} items sold
            </span>
          </div>
          <p className="mt-4 max-w-lg text-xs leading-5 text-emerald-100/90">
            Before order-level offers, fees and settlement adjustments. This is
            sales revenue, not your bank payout.
          </p>
        </section>
        <div className="grid grid-cols-1 gap-4 min-[450px]:grid-cols-2">
          {[
            {
              label: "Total orders",
              amount: loading ? "—" : summary.total,
              note: "Placed in this period",
              Icon: ShoppingBag,
            },
            {
              label: "In progress",
              amount: value(summary.pending),
              note: `${loading ? "—" : summary.progress} orders awaiting delivery`,
              Icon: Clock3,
            },
            {
              label: "Average order value",
              amount: value(summary.average),
              note: "Per delivered order",
              Icon: ArrowUpRight,
            },
            {
              label: "Delivered orders",
              amount: loading ? "—" : summary.delivered,
              note: "Counted in gross earnings",
              Icon: PackageCheck,
            },
          ].map(({ label, amount, note, Icon }) => (
            <section
              key={label}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm text-neutral-600">{label}</h3>
                <Icon size={18} className="text-neutral-500" />
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
                {amount}
              </div>
              <p className="mt-2 text-xs text-neutral-500">{note}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-semibold">Sales over time</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Delivered product sales, grouped by order date · IST
              </p>
            </div>
            <span className="flex items-center gap-2 text-xs text-neutral-600">
              <span className="h-2 w-2 rounded-full bg-[#33745d]" />
              Gross earnings
            </span>
          </div>
          {loading ? (
            <div
              className="flex h-64 items-center justify-center text-sm text-neutral-500"
              role="status"
            >
              Loading all orders for this period…
            </div>
          ) : summary.delivered === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-[#eef4ee] p-3">
                <PackageCheck className="text-[#33745d]" size={25} />
              </div>
              <h4 className="font-medium">
                Your next delivery starts the story
              </h4>
              <p className="mt-2 max-w-xs text-sm text-neutral-500">
                Completed orders will appear here as your sales grow.
              </p>
              <Link
                href="/orders"
                className="mt-4 text-sm font-semibold text-[#286048] underline underline-offset-4"
              >
                View orders
              </Link>
            </div>
          ) : (
            <div
              className="mt-6 h-64"
              role="img"
              aria-label={`Gross earnings ${money(summary.earned)} from ${summary.delivered} delivered orders. Daily values are shown in the order breakdown below.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={summary.daily}
                  margin={{ top: 10, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="earningsFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#33745d"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor="#33745d"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="#e8e8e8"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={45}
                    tick={{ fill: "#737373", fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={62}
                    tick={{ fill: "#737373", fontSize: 11 }}
                    tickFormatter={(n) =>
                      new Intl.NumberFormat("en-IN", {
                        notation: "compact",
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 1,
                      }).format(n / 100)
                    }
                  />
                  <Tooltip
                    formatter={(n) => [money(Number(n)), "Gross earnings"]}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#e5e5e5",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="linear"
                    dataKey="sales"
                    stroke="#33745d"
                    strokeWidth={2.5}
                    fill="url(#earningsFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
        <aside className="rounded-2xl border border-[#dce5db] bg-[#f0f4ed] p-6">
          <div className="mb-5 inline-flex rounded-xl bg-white p-2.5 text-[#355a40]">
            <CircleHelp size={20} />
          </div>
          <h3 className="text-base font-semibold">Know your numbers</h3>
          <div className="mt-5 space-y-5 text-sm">
            <div>
              <h4 className="font-medium">Delivered = earned</h4>
              <p className="mt-1 leading-6 text-neutral-600">
                Only delivered orders count towards your gross earnings.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Still on the way</h4>
              <p className="mt-1 leading-6 text-neutral-600">
                Active orders appear under In progress. Cancelled, rejected and
                other closed orders are excluded.
              </p>
            </div>
            <div className="border-t border-[#d3dfcf] pt-4">
              <h4 className="font-medium">Sales & payouts are different</h4>
              <p className="mt-1 leading-6 text-neutral-600">
                Bank payouts and settlement deductions aren&apos;t tracked here
                yet.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h3 className="font-semibold">Order breakdown</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Orders placed {period}. Amounts include your store&apos;s products
              only.
            </p>
          </div>
          <button
            type="button"
            onClick={exportOrders}
            disabled={loading || !filtered.length}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowDownToLine size={15} />
            Export CSV
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-neutral-200 bg-neutral-50/60 px-5 py-3">
          <div className="flex flex-wrap gap-1" aria-label="Filter orders">
            {[
              ["all", "All orders"],
              ["delivered", "Delivered"],
              ["progress", "In progress"],
              ["excluded", "Excluded"],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                aria-pressed={filter === id}
                onClick={() => {
                  setFilter(id);
                  setPage(0);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${filter === id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3">
            <Search size={15} className="text-neutral-500" />
            <input
              aria-label="Search order ID"
              placeholder="Search order ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="h-9 w-40 bg-transparent text-xs outline-none"
            />
          </label>
        </div>
        {loading ? (
          <div
            role="status"
            className="p-12 text-center text-sm text-neutral-500"
          >
            Calculating complete totals…
          </div>
        ) : !visible.length ? (
          <div className="p-12 text-center">
            <ShoppingBag size={25} className="mx-auto mb-3 text-neutral-400" />
            <p className="font-medium">
              {orders.length
                ? "No matching orders"
                : "A fresh start for this period"}
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              {orders.length
                ? "Try another order ID or change the status filter."
                : "Your orders and earnings will appear here when customers shop with you."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-neutral-100 text-xs text-neutral-500">
                <tr>
                  {[
                    "Order",
                    "Placed",
                    "Status",
                    "Payment",
                    "Items",
                    "Product sales",
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className={`px-5 py-3 font-medium ${label === "Product sales" ? "text-right" : ""}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visible.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70">
                    <td className="px-5 py-4 font-medium">{order.id}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-neutral-600">
                      {dateLabel(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs capitalize ${orderGroup(order.status) === "delivered" ? "bg-emerald-50 text-emerald-800" : orderGroup(order.status) === "progress" ? "bg-amber-50 text-amber-800" : "bg-neutral-100 text-neutral-600"}`}
                      >
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {order.paymentMethod === "cod"
                        ? "COD"
                        : order.paymentMethod === "online"
                          ? "Online"
                          : order.paymentMethod}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {order.units}
                    </td>
                    <td className="px-5 py-4 text-right font-medium tabular-nums">
                      {money(order.salesPaise)}
                      {orderGroup(order.status) === "excluded" && (
                        <span className="mt-1 block text-[10px] font-normal text-neutral-500">
                          Not included
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4 text-xs text-neutral-500">
            <span>
              {currentPage * 10 + 1}–
              {Math.min((currentPage + 1) * 10, filtered.length)} of{" "}
              {filtered.length} orders
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50 disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === lastPage}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50 disabled:opacity-30"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
      <p className="pb-2 text-xs leading-5 text-neutral-500">
        All dates use Indian Standard Time. Product-level discounts are
        reflected in sales. Order-level offers, refunds, commissions and payout
        adjustments are not deducted from these gross figures.
      </p>
    </main>
  );
}
