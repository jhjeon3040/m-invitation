"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-white pt-20 overflow-hidden">
      {/* Warm gradient background with mesh */}
      <div className="absolute inset-0 bg-gradient-mesh bg-noise" />

      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-rose-light)] border border-[var(--color-coral-400)] rounded-full text-sm text-[var(--color-brown-700)]">
            <span className="w-1.5 h-1.5 bg-[var(--color-coral-500)] rounded-full" />
            모바일 청첩장의 새로운 기준
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] font-bold text-[var(--color-brown-900)] leading-[1.15] tracking-tight">
            가장 정중한
            <br />
            <span className="text-gradient-coral">초대의 시작</span>
          </h1>
        </motion.div>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-[var(--color-brown-700)] text-lg sm:text-xl max-w-md mx-auto mb-10 leading-relaxed"
        >
          복잡한 절차 없이, 오직 두 사람에게만 집중하세요.
          <br />
          나머지는 연정이 알아서 할게요.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <Link href="/login">
            <button className="w-full sm:w-auto px-8 py-4 bg-[var(--color-coral-500)] text-white text-base font-semibold rounded-2xl btn-romantic hover:shadow-lg active:scale-[1.02] transition-all duration-150">
              청첩장 만들기
            </button>
          </Link>
          <Link href="/demo/journey">
            <button className="w-full sm:w-auto px-8 py-4 bg-[var(--color-rose-light)] text-[var(--color-coral-500)] text-base font-semibold rounded-2xl hover-lift active:scale-[1.02] transition-all duration-150">
              샘플 보기
            </button>
          </Link>
        </motion.div>

        {/* Features tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-20"
        >
          {[
            { icon: "⚡", text: "쉽고 빠른 제작" },
            { icon: "✨", text: "부담 없는 시작" },
            { icon: "🎨", text: "감각적인 디자인" },
          ].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-coral-400)] rounded-full text-sm text-[var(--color-brown-700)]"
            >
              <span>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </motion.div>

        {/* Phone Mockups */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative flex justify-center items-end gap-4 sm:gap-8"
        >
          {/* Left Phone */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[140px] sm:w-[180px] lg:w-[220px]"
          >
            <div className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-[#E5E8EB] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="aspect-[9/19.5] relative">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />

                {/* Screen Content */}
                <div className="absolute inset-0 bg-white">
                  <div className="relative h-[55%]">
                    <Image
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop"
                      alt="Wedding"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[10px] sm:text-xs text-[#8B95A1] mb-1">우리의 시작</p>
                    <p className="text-sm sm:text-base font-semibold text-[#191F28]">수진 & 현우</p>
                    <p className="text-[10px] sm:text-xs text-[#8B95A1] mt-1">2026.05.16</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Phone (Main) */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="relative w-[180px] sm:w-[240px] lg:w-[280px] z-10"
          >
            <div className="relative bg-white rounded-[32px] sm:rounded-[44px] border border-[#E5E8EB] shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="aspect-[9/19.5] relative">
                {/* Notch */}
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-7 bg-black rounded-full z-10" />

                {/* Screen Content */}
                <div className="absolute inset-0 bg-white">
                  <div className="relative h-[58%]">
                    <Image
                      src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop"
                      alt="Wedding"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                  <div className="p-5 text-center -mt-4">
                    <p className="text-xs text-[#8B95A1] mb-1">소중한 분들을 초대합니다</p>
                    <p className="text-lg sm:text-xl font-bold text-[#191F28]">민영 & 지훈</p>
                    <p className="text-xs text-[#8B95A1] mt-1 mb-4">2026년 10월 26일 토요일</p>
                    <div className="w-full h-11 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
                      <span className="text-sm font-medium text-[#191F28]">참석 여부 알리기</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Phone */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="relative w-[140px] sm:w-[180px] lg:w-[220px]"
          >
            <div className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-[#E5E8EB] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="aspect-[9/19.5] relative">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />

                {/* Screen Content */}
                <div className="absolute inset-0 bg-white">
                  <div className="relative h-[55%]">
                    <Image
                      src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop"
                      alt="Wedding"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[10px] sm:text-xs text-[#8B95A1] mb-1">사랑의 시작</p>
                    <p className="text-sm sm:text-base font-semibold text-[#191F28]">유나 & 성민</p>
                    <p className="text-[10px] sm:text-xs text-[#8B95A1] mt-1">2026.04.12</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
