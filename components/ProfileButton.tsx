"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";

export default function ProfileButton() {
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/sign-in' });
    setIsOpen(false);
  };

  // Don't render until Clerk is loaded and user is available
  if (!isLoaded || !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#171719] flex items-center justify-center text-white font-semibold text-sm">
          {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-[#171719]">Profile</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-medium text-[#171719]">
              {user.firstName || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-[#C86565] hover:bg-[#F7E4E4] transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
