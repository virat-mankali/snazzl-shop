"use client";

import { BarChart2, ClipboardList, LayoutDashboard, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ShopSidebarItem = "overview" | "products" | "orders" | "analytics";

type ShopSidebarProps = {
  activeItem: ShopSidebarItem;
};

const navItems = [
  {
    id: "overview",
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Product",
    href: "/products",
    icon: Package,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: null,
    icon: BarChart2,
  },
] satisfies {
  id: ShopSidebarItem;
  label: string;
  href: string | null;
  icon: typeof LayoutDashboard;
}[];

export default function ShopSidebar({ activeItem }: ShopSidebarProps) {
  return (
    <aside className="w-[248px] shrink-0 border-r border-slate-200/80 bg-[#171719] text-white">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Image
              src="/logo.png"
              alt="Snazzl Logo"
              width={28}
              height={28}
              className="rounded"
            />
          </div>
          <div>
            <span className="block text-sm font-semibold leading-4">Snazzl</span>
            <span className="text-xs text-slate-400">Shop workspace</span>
          </div>
        </div>

        <nav className="mt-7 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-[#F8EEE8] text-[#171719] shadow-lg shadow-black/10"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`;

            if (!item.href) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${className} group relative cursor-default`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-full bg-white px-2 py-0.5 text-xs text-slate-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    Coming Soon
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.id} href={item.href} className={className}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <div className="text-xs font-medium text-slate-400">Today</div>
          <div className="mt-1 text-lg font-semibold">Live operations</div>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Track new orders, stock and payouts from one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
