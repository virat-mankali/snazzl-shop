"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function BrandStoreGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasHandledAuthChange = useRef(false);

  useEffect(() => {
    // Don't process if already redirecting or if we've already handled this
    if (isRedirecting || hasHandledAuthChange.current) return;

    // Wait for everything to load
    if (!isLoaded) return;

    // If not signed in, redirect to signin
    if (!isSignedIn) {
      hasHandledAuthChange.current = true;
      setIsRedirecting(true);
      router.replace("/sign-in");
      return;
    }

    // Check role from Clerk's publicMetadata
    const userRole = user?.publicMetadata?.role as string | undefined;

    // If signed in but role is not brandStore
    if (isSignedIn && userRole !== "brandStore") {
      hasHandledAuthChange.current = true;
      setIsRedirecting(true);
      
      // Sign out gracefully and redirect
      signOut({ redirectUrl: "/unauthorized" }).catch((err) => {
        console.error("Sign out error:", err);
        // Fallback to direct redirect if sign out fails
        router.replace("/unauthorized");
      });
    }
  }, [isLoaded, isSignedIn, user, router, signOut, isRedirecting]);

  // Show loading while checking auth or during redirect
  if (!isLoaded || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Check role from Clerk's publicMetadata
  const userRole = user?.publicMetadata?.role as string | undefined;

  // Show content only if explicitly authorized
  if (isLoaded && isSignedIn && userRole === "brandStore") {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-lg text-zinc-600 dark:text-zinc-400">Verifying access...</div>
    </div>
  );
}
