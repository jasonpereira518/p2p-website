"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateLogin, getStoredSession, setSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getStoredSession();
    if (session) {
      if (session.role === "driver") {
        router.replace("/admin/driver-dashboard");
      } else {
        router.replace("/admin/dashboard");
      }
      return;
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = validateLogin(username, password);
    if (!user) {
      setError("Invalid username or password.");
      return;
    }
    setSession(user);
    if (user.role === "driver") {
      router.push("/admin/driver-dashboard");
    } else {
      router.push("/admin/dashboard");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-unc-login">
        <div className="text-white/90">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-unc-login">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              P2P Admin
            </h1>
            <p className="mt-2 text-white/80 text-sm">
              Sign in with your username and password
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white shadow-xl border border-[var(--unc-carolina-blue)]/20 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[var(--unc-navy)] mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[var(--unc-navy)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--unc-carolina-blue)] focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--unc-navy)] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[var(--unc-navy)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--unc-carolina-blue)] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[var(--unc-carolina-blue)] text-white font-semibold hover:bg-[var(--unc-carolina-blue-light)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--unc-carolina-blue)] focus:ring-offset-2 focus:ring-offset-white"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-white/70 text-xs">
            Demo: arivera / admin123 · jlee / manager123 · schen / driver123
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center w-full py-2.5 text-sm text-white/80 hover:text-white transition-colors"
          >
            ← Back to P2P Live
          </Link>
        </div>
      </div>
    </div>
  );
}
