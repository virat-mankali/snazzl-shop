import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  periodRange,
  summarizeEarnings,
  orderGroup,
  type EarningsOrder,
} from "../lib/earnings";

describe("partner earnings", () => {
  test("uses IST calendar boundaries, including year rollover and leap years", () => {
    const range = periodRange("month", Date.parse("2026-10-31T20:00:00Z"));
    assert.equal(range.start, Date.parse("2026-10-31T18:30:00Z"));
    assert.equal(range.end, Date.parse("2026-11-01T18:30:00Z"));
    const december = periodRange(
      "lastMonth",
      Date.parse("2026-01-15T00:00:00Z"),
    );
    assert.equal(december.start, Date.parse("2025-11-30T18:30:00Z"));
    assert.equal(december.end, Date.parse("2025-12-31T18:30:00Z"));
    const february = periodRange(
      "lastMonth",
      Date.parse("2024-03-15T00:00:00Z"),
    );
    assert.equal((february.end - february.start) / 86400000, 29);
    const days = periodRange("90days", Date.parse("2026-11-14T00:00:00Z"));
    assert.equal((days.end - days.start) / 86400000, 90);
  });
  test("counts delivered sales only, excludes cancelled/refunded/unknown statuses, and sums integer paise", () => {
    const { start, end } = periodRange(
      "month",
      Date.parse("2026-11-14T00:00:00Z"),
    );
    const row: EarningsOrder = {
      id: "order",
      status: "delivered",
      createdAt: start,
      salesPaise: 10010,
      units: 2,
      paymentMethod: "online",
    };
    const orders = [
      row,
      { ...row, salesPaise: 20020 },
      { ...row, status: "picked_up", salesPaise: 50000 },
      ...["cancelled", "rejected", "refunded", "mystery"].map((status) => ({
        ...row,
        status,
      })),
      { ...row, createdAt: end },
      { ...row, createdAt: start - 1 },
    ];
    const totals = summarizeEarnings(orders, start, end);
    assert.equal(totals.earned, 30030);
    assert.equal(totals.pending, 50000);
    assert.equal(totals.delivered, 2);
    assert.equal(totals.average, 15015);
    assert.equal(totals.units, 4);
    assert.equal(totals.total, 7);
    assert.equal(totals.excluded, 4);
    assert.equal(
      totals.daily.reduce((sum, day) => sum + day.sales, 0),
      totals.earned,
    );
    assert.equal(orderGroup("delivering"), "progress");
    assert.equal(summarizeEarnings([], start, end).average, 0);
  });
});
