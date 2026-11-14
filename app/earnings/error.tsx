"use client";

import Link from "next/link";

export default function EarningsError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">
          We couldn’t load your earnings
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Your orders are safe. Please try again to get the latest figures.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="mt-4 block text-sm text-neutral-600 underline"
        >
          Back to overview
        </Link>
      </div>
    </main>
  );
}
