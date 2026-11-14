export type EarningsOrder = {
  id: string;
  createdAt: number;
  status: string;
  paymentMethod: string;
  salesPaise: number;
  units: number;
};
export type EarningsPeriod = "month" | "lastMonth" | "90days";
const day = 86400000;
const ist = 330 * 60000;
export const dateLabel = (timestamp: number) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(timestamp);
export const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
export function periodRange(period: EarningsPeriod, now: number) {
  const local = new Date(now + ist);
  const year = local.getUTCFullYear(),
    month = local.getUTCMonth();
  const today = Date.UTC(year, month, local.getUTCDate()) - ist;
  if (period === "lastMonth")
    return {
      start: Date.UTC(year, month - 1, 1) - ist,
      end: Date.UTC(year, month, 1) - ist,
    };
  return {
    start:
      period === "month" ? Date.UTC(year, month, 1) - ist : today - 89 * day,
    end: today + day,
  };
}
const activeStatuses = new Set([
  "new",
  "placed",
  "confirmed",
  "started",
  "accepted",
  "assigned",
  "preparing",
  "ready_for_pickup",
  "shipped",
  "picked",
  "picked_up",
  "delivering",
  "out_for_delivery",
]);
export function orderGroup(status: string) {
  if (status === "delivered") return "delivered";
  return activeStatuses.has(status) ? "progress" : "excluded";
}
export function summarizeEarnings(
  orders: EarningsOrder[],
  start: number,
  end: number,
) {
  const daily = Array.from(
    { length: Math.ceil((end - start) / day) },
    (_, i) => ({
      timestamp: start + i * day,
      label: dateLabel(start + i * day),
      sales: 0,
    }),
  );
  let earned = 0,
    pending = 0,
    delivered = 0,
    progress = 0,
    units = 0,
    excluded = 0;
  for (const order of orders) {
    if (order.createdAt < start || order.createdAt >= end) continue;
    const group = orderGroup(order.status);
    if (group === "delivered") {
      earned += order.salesPaise;
      delivered++;
      units += order.units;
      daily[Math.floor((order.createdAt - start) / day)].sales +=
        order.salesPaise;
    } else if (group === "progress") {
      pending += order.salesPaise;
      progress++;
    } else excluded++;
  }
  return {
    earned,
    pending,
    delivered,
    progress,
    units,
    excluded,
    total: delivered + progress + excluded,
    average: delivered ? Math.round(earned / delivered) : 0,
    daily,
  };
}
