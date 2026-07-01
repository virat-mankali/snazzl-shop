"use client";

import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";

type ClerkErrorDetail = {
  code?: string;
  message?: string;
};

function getFirstClerkError(error: unknown): ClerkErrorDetail | undefined {
  if (typeof error !== "object" || error === null || !("errors" in error)) {
    return undefined;
  }

  const errors = (error as { errors?: unknown }).errors;
  if (!Array.isArray(errors)) return undefined;

  const [firstError] = errors;
  if (typeof firstError !== "object" || firstError === null) {
    return undefined;
  }

  return firstError as ClerkErrorDetail;
}

export default function SignInPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLoaded = isSignInLoaded && isAuthLoaded;

  useEffect(() => {
    if (!isAuthLoaded || !isSignedIn) return;

    router.replace("/");
  }, [isAuthLoaded, isSignedIn, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        try {
          await setActive({ session: result.createdSessionId });
          // Force a full page reload to ensure auth state is properly updated.
          window.location.href = "/";
        } catch {
          await signOut({ redirectUrl: "/sign-in" });
        }
      }
    } catch (err: unknown) {
      const clerkError = getFirstClerkError(err);
      const message = clerkError?.message || "Invalid email or password";

      if (
        clerkError?.code === "session_exists" ||
        message.toLowerCase().includes("session already exists")
      ) {
        router.replace("/");
        return;
      }

      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Snazzl Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h2 className="text-center text-3xl font-bold text-[#171719]">
            Snazzl Shop
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[#F7E4E4] border border-[#F0D1D1] text-[#C86565] px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm text-[#171719] focus:outline-none focus:ring-[#F3E7D7] focus:border-[#D4A373]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm text-[#171719] focus:outline-none focus:ring-[#F3E7D7] focus:border-[#D4A373]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#171719] hover:bg-[#2A2A2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F3E7D7] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-4">
          Contact your administrator for access credentials
        </p>
      </div>
    </div>
  );
}
