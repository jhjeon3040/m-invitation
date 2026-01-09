"use client";

import Link from "next/link";
import { useState } from "react";

const footerLinks = {
  product: ["기능 소개", "테마 갤러리", "가격 안내", "업데이트"],
  support: ["자주 묻는 질문", "1:1 문의", "이용 가이드"],
  company: ["회사 소개", "채용", "블로그"],
  legal: ["이용약관", "개인정보처리방침"],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[var(--color-sage-light)] to-[var(--color-cream-bg)] border-t border-[var(--color-coral-400)]">
      <div className="max-w-5xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand & Newsletter */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-0.5">
              <span className="text-xl font-bold text-[var(--color-brown-900)]">연정</span>
              <span className="text-xl font-bold text-[var(--color-coral-500)]">.</span>
            </Link>

            <p className="text-sm text-[var(--color-brown-500)] leading-relaxed max-w-xs">
              소중한 순간을 가장 아름답게.
              <br />
              프리미엄 모바일 청첩장 서비스.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-brown-900)]">뉴스레터 구독</p>
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    className="flex-1 px-4 py-3 bg-white border border-[var(--color-coral-400)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-coral-500)] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[var(--color-coral-500)] text-white text-sm font-medium rounded-xl btn-romantic active:scale-[1.02] transition-all"
                  >
                    구독
                  </button>
                </form>
              ) : (
                <p className="text-[var(--color-coral-500)] text-sm font-medium">
                  구독해주셔서 감사합니다!
                </p>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--color-brown-900)]">제품</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--color-brown-900)]">고객지원</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--color-brown-900)]">회사</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--color-brown-900)]">법적 고지</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--color-coral-400)] border-opacity-30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--color-brown-500)]">
              2026 연정. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[var(--color-brown-500)] hover:text-[var(--color-coral-500)] transition-colors"
                aria-label="카카오톡"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.83 1.9 5.32 4.72 6.72-.2.74-.73 2.68-.84 3.1-.13.54.2.53.42.39.17-.11 2.69-1.79 3.77-2.52.61.09 1.25.14 1.93.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
