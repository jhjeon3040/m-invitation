"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const benefits = [
  { icon: "💳", text: "결제 정보 없이 시작" },
  { icon: "⚡", text: "빠르고 간편한 제작" },
  { icon: "🔄", text: "자유로운 수정" },
];

export function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-32 md:py-40 px-5 bg-gradient-mesh bg-noise relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-rose-light)] border border-[var(--color-coral-400)] rounded-full text-sm text-[var(--color-brown-700)] mb-8">
            <span className="text-lg">💌</span>
            망설이지 말고 시작하세요
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brown-900)] mb-6 leading-tight">
            가장 정중한 초대,
            <br />
            <span className="text-gradient-romantic">지금 바로</span> 만들어보세요
          </h2>

          {/* Subtext */}
          <p className="text-[var(--color-brown-700)] text-lg mb-10 max-w-md mx-auto">
            복잡한 과정은 덜어내고, 꼭 필요한 것만 담았습니다.
            <br />
            지금 무료로 시작해보세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/login">
              <button className="w-full sm:w-auto px-10 py-5 bg-[var(--color-coral-500)] text-white text-lg font-semibold rounded-2xl btn-romantic active:scale-[1.02] transition-all duration-150">
                무료로 시작하기
              </button>
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border border-[var(--color-coral-400)] text-[var(--color-coral-500)] text-lg font-semibold rounded-2xl hover-lift active:scale-[1.02] transition-all duration-150">
              1:1 문의하기
            </button>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {benefits.map((benefit, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white glass-card border border-[var(--color-sage-green)] rounded-full text-sm text-[var(--color-brown-700)] animate-scale-pulse"
              >
                <span>{benefit.icon}</span>
                {benefit.text}
              </motion.span>
            ))}
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-[var(--color-coral-400)] border-opacity-30"
          >
            <p className="text-sm text-[var(--color-brown-500)] mb-2">
              이미 <span className="font-semibold text-[var(--color-brown-900)]">10,000쌍</span>의 커플이 연정을 선택했습니다
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl">⭐</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
