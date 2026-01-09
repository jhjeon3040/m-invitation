"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const themes = [
  {
    id: "minimal",
    name: "미니멀",
    description: "본질에 집중한 간결함",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    bgColor: "#FAFAFA",
  },
  {
    id: "classic",
    name: "클래식",
    description: "변하지 않는 우아함",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop",
    bgColor: "#FFF8F5",
  },
  {
    id: "modern",
    name: "모던",
    description: "세련된 감각의 조화",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    bgColor: "#F5F7FA",
  },
];

export function PreviewSection() {
  const [activeTheme, setActiveTheme] = useState(themes[1]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="preview"
      ref={sectionRef}
      className="py-32 md:py-40 px-5 bg-[var(--color-cream-bg)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-coral-400)] rounded-full text-sm text-[var(--color-brown-700)] mb-6">
            Themes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brown-900)] mb-4 leading-tight">
            취향에 맞는
            <br />
            스타일을 찾아보세요
          </h2>
          <p className="text-[var(--color-brown-500)] text-lg max-w-md mx-auto">
            어떤 분위기를 원하시나요? 가장 어울리는 디자인을 골라보세요.
          </p>
        </motion.div>

        {/* Preview Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="relative w-[280px] sm:w-[300px]">
              {/* Phone Frame */}
              <div className="relative bg-white rounded-[44px] border border-[var(--color-coral-400)] shadow-romantic overflow-hidden">
                <div className="aspect-[9/19.5] relative">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />

                  {/* Screen Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTheme.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                      style={{ backgroundColor: activeTheme.bgColor }}
                    >
                      {/* Status Bar */}
                      <div className="h-12 flex justify-between items-end px-6 text-[11px] font-medium text-[#191F28]/50">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 bg-black/20 rounded-sm" />
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative h-[52%] mt-2">
                        <Image
                          src={activeTheme.image}
                          alt={activeTheme.name}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${activeTheme.bgColor} 0%, transparent 50%)`,
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 text-center -mt-6 relative">
                        <p className="text-xs text-[#8B95A1]">우리의 시작</p>
                        <h3 className="text-xl font-bold text-[#191F28] mt-1">민영 & 지훈</h3>
                        <p className="text-xs text-[#8B95A1] mt-2">2026년 10월 26일 토요일</p>

                        <button className="w-full mt-5 py-3.5 bg-[#191F28] text-white text-sm font-medium rounded-xl">
                          참석 여부 알리기
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Theme Selector */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-[#191F28] mb-6">
              테마 선택
            </h3>

            <div className="space-y-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 ${
                    activeTheme.id === theme.id
                      ? "bg-[var(--color-rose-light)] border-[var(--color-coral-500)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "bg-white border-[var(--color-coral-400)] border-opacity-20 hover:border-opacity-100"
                  }`}
                >
                  {/* Color Preview */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: theme.bgColor }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-brown-900)]">{theme.name}</p>
                    <p className="text-sm text-[var(--color-brown-500)] truncate">{theme.description}</p>
                  </div>

                  {/* Check */}
                  {activeTheme.id === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-[#191F28] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {/* More Themes CTA */}
            <div className="mt-8 p-6 bg-gradient-to-br from-[var(--color-rose-light)] to-[var(--color-sage-light)] rounded-2xl border border-[var(--color-coral-400)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-semibold text-[var(--color-brown-900)]">더 많은 디자인이 있어요</p>
                  <p className="text-sm text-[var(--color-brown-700)]">당신에게 딱 맞는 테마를 발견해보세요.</p>
                </div>
              </div>
              <button className="w-full py-4 bg-[var(--color-coral-500)] text-white font-semibold rounded-xl btn-romantic active:scale-[1.02] transition-all">
                테마 전체 보기
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
