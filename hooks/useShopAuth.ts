"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useShopAuth() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  
  // Fetch brand store from Convex database
  const brandStore = useQuery(api.brandStores.getCurrentBrandStore);

  const isLoading = !isClerkLoaded || (user && brandStore === undefined);
  const isAuthorized = brandStore !== null && brandStore !== undefined;

  useEffect(() => {
    // Wait for everything to load
    if (isLoading) return;

    // If not signed in with Clerk, redirect to sign-in
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // If user is signed in but doesn't exist in brandStores table with correct role
    if (user && brandStore === null) {
      setShowError(true);
      // Sign out and redirect after a delay
      setTimeout(async () => {
        await signOut();
        router.push("/sign-in");
      }, 3000);
    }
  }, [isLoading, user, brandStore, router, signOut]);

  return {
    brandStore,
    isLoading,
    isAuthorized,
    clerkUser: user,
    showError,
    setShowError,
  };
}
