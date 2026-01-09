"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/hooks/useUser";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "기능", href: "#features" },
  { label: "미리보기", href: "#preview" },
  { label: "후기", href: "#testimonials" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled
            ? "bg-[var(--color-cream-bg)]/95 backdrop-blur-md border-b border-[var(--color-coral-400)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-xl font-bold text-[var(--color-brown-900)]">연정</span>
              <span className="text-xl font-bold text-[var(--color-coral-500)]">.</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm text-[var(--color-brown-700)] hover:text-[var(--color-coral-500)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-20 h-9 bg-[var(--color-peach-light)] rounded-lg animate-pulse" />
              ) : user ? (
                <Link href="/dashboard">
                  <button className="px-5 py-2.5 bg-[var(--color-coral-500)] text-white text-sm font-medium rounded-xl btn-romantic active:scale-[1.02] transition-all">
                    대시보드
                  </button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-[var(--color-brown-700)] hover:text-[var(--color-coral-500)] transition-colors"
                  >
                    로그인
                  </Link>
                  <Link href="/login">
                    <button className="px-5 py-2.5 bg-[var(--color-coral-500)] text-white text-sm font-medium rounded-xl btn-romantic active:scale-[1.02] transition-all">
                      시작하기
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#191F28]"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[var(--color-cream-bg)]"
          >
            <div className="flex flex-col h-full px-5">
              {/* Mobile Header */}
              <div className="flex justify-between items-center h-16">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-0.5"
                >
                  <span className="text-xl font-bold text-[var(--color-brown-900)]">연정</span>
                  <span className="text-xl font-bold text-[var(--color-coral-500)]">.</span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[var(--color-brown-900)]"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 flex flex-col justify-center items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-semibold text-[var(--color-brown-900)]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pb-10 space-y-3"
              >
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <button className="w-full py-4 bg-[var(--color-coral-500)] text-white font-semibold rounded-2xl btn-romantic">
                      대시보드
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <button className="w-full py-4 bg-[var(--color-coral-500)] text-white font-semibold rounded-2xl btn-romantic">
                        무료로 시작하기
                      </button>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center text-sm text-[var(--color-brown-500)]"
                    >
                      이미 계정이 있으신가요? 로그인
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
