"use client";

import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";
import ProfileButton from "./ProfileButton";

type ShopTopbarProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function ShopTopbar({
  title,
  description,
  children,
}: ShopTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-6 py-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-7 text-[#171719]">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {children ?? (
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search"
                className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#D4A373] focus:bg-white focus:ring-3 focus:ring-[#F3E7D7]"
              />
            </div>
          )}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            <Bell size={17} />
          </button>
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
