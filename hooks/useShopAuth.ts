"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const SHOP_ROLE = "shop";

export function useShopAuth() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const role = user?.publicMetadata?.role;
  const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : role;
  const isLoading = !isClerkLoaded;
  const isAuthorized = Boolean(user) && normalizedRole === SHOP_ROLE;
  const isRejected = !isLoading && Boolean(user) && !isAuthorized;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (isRejected) {
      const timeoutId = window.setTimeout(async () => {
        await signOut();
        router.replace("/sign-in");
      }, 3000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [isLoading, user, isRejected, router, signOut]);

  return {
    isLoading,
    isAuthorized,
    clerkUser: user,
    showError: isRejected && !isErrorDismissed,
    setShowError: (isVisible: boolean) => setIsErrorDismissed(!isVisible),
  };
}
