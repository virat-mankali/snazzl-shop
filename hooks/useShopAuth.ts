"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const getCurrentBrandStore = makeFunctionReference<"query">(
  "brandStores:getCurrentBrandStore"
);

export function useShopAuth() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  
  // Fetch brand store from Convex database
  const brandStore = useQuery(getCurrentBrandStore);

  const isLoading = !isClerkLoaded || (user && brandStore === undefined);
  const isAuthorized = brandStore !== null && brandStore !== undefined;
  const isRejected = !isLoading && Boolean(user) && brandStore === null;

  useEffect(() => {
    // Wait for everything to load
    if (isLoading) return;

    // If not signed in with Clerk, redirect to sign-in
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // If user is signed in but doesn't exist in brandStores table with correct role
    if (isRejected) {
      // Sign out and redirect after a delay
      const timeoutId = window.setTimeout(async () => {
        await signOut();
        router.push("/sign-in");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [isLoading, user, isRejected, router, signOut]);

  return {
    brandStore,
    isLoading,
    isAuthorized,
    clerkUser: user,
    showError: isRejected && !isErrorDismissed,
    setShowError: (isVisible: boolean) => setIsErrorDismissed(!isVisible),
  };
}
