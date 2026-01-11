"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (loading || !user) {
    return null;
  }

  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "사용자";

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 rounded-full py-2 px-3 transition-colors"
      >
        <span className="text-sm text-gray-700 hidden sm:block">{userName}</span>
        <div className="w-9 h-9 rounded-full bg-coral-100 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <span className="text-coral-600 font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
