"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/hooks/useUser";

const navItems = [
  { label: "기능", href: "#features" },
  { label: "미리보기", href: "#preview" },
  { label: "후기", href: "#testimonials" },
  { label: "고객지원", href: "#support" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl py-3 shadow-soft"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="group flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-display font-bold text-brown-900 tracking-tight">
                연정
              </span>
              <span className="text-coral-500 text-2xl">.</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="relative px-4 py-2 text-sm text-gray-600 tracking-wide transition-colors hover:text-coral-600 group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-coral-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center space-x-4"
            >
              {loading ? (
                <div className="w-24 h-9 bg-gray-100 rounded-full animate-pulse" />
              ) : user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-coral-500 text-white text-sm font-medium rounded-full hover:bg-coral-600 transition-all duration-300 shadow-sm hover:shadow-coral"
                >
                  대시보드
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-500 hover:text-brown-900 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 bg-coral-500 text-white text-sm font-medium rounded-full hover:bg-coral-600 transition-all duration-300 shadow-sm hover:shadow-coral"
                  >
                    무료로 시작하기
                  </Link>
                </>
              )}
            </motion.div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-brown-900 p-2"
            >
              <span className="sr-only">메뉴 열기</span>
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-[2px] bg-current rounded-full" />
                <span className="w-4 h-[2px] bg-current rounded-full ml-auto" />
                <span className="w-full h-[2px] bg-current rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-cream-bg"
          >
            <div className="relative h-full flex flex-col px-6 py-6">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <span className="text-2xl font-display font-bold text-brown-900">
                    연정
                  </span>
                  <span className="text-coral-500 text-2xl">.</span>
                </Link>

                <motion.button
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-brown-900 p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <nav className="flex-1 flex flex-col justify-center items-center space-y-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-display text-brown-900 hover:text-coral-500 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center space-y-4 pb-8"
              >
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full max-w-xs bg-coral-500 text-white py-4 rounded-full font-medium text-lg hover:bg-coral-600 transition-colors text-center"
                  >
                    대시보드
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-gray-500"
                    >
                      로그인
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full max-w-xs bg-coral-500 text-white py-4 rounded-full font-medium text-lg hover:bg-coral-600 transition-colors text-center"
                    >
                      무료로 시작하기
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
