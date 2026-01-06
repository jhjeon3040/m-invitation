"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

const themes = [
  {
    id: "minimal",
    name: "미니멀",
    emoji: "🤍",
    color: "#F8F8F8",
    accent: "#E8E8E8",
    description: "깔끔하고 세련된 여백의 미학",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "classic",
    name: "클래식",
    emoji: "🌸",
    color: "#FFF5F0",
    accent: "#FFE4D6",
    description: "따뜻하고 우아한 전통의 아름다움",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "modern",
    name: "모던",
    emoji: "✨",
    color: "#F0F4F8",
    accent: "#E2E8F0",
    description: "트렌디하고 감각적인 도시적 무드",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
  },
];

export function PreviewSection() {
  const [activeTheme, setActiveTheme] = useState(themes[1]);
  const [isHovering, setIsHovering] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);

  return (
    <section id="preview" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dreamy" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-96 h-96 border border-dashed border-coral-200/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-20 w-64 h-64 border border-coral-200/20 rounded-full"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-coral-500 font-medium text-sm tracking-widest uppercase bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-dreamy mb-6"
          >
            <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity }}>
              ✦
            </motion.span>
            Preview
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display text-brown-900 mb-6">
            직접 <span className="text-gradient-romantic">확인</span>해보세요
          </h2>

          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto">
            다양한 테마 중 당신의 이야기에
            <br className="sm:hidden" />
            가장 어울리는 스타일을 찾아보세요.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
            ref={phoneRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              animate={{ 
                scale: isHovering ? 1.05 : 1,
                rotate: isHovering ? 2 : 0
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-8 rounded-[4rem] blur-3xl"
                style={{ backgroundColor: `${activeTheme.color}80` }}
              />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border border-dashed border-coral-200/30 rounded-[5rem]"
              />

              <div className="relative w-[300px] h-[620px] bg-gray-900 rounded-[3.5rem] border-[8px] border-gray-800 shadow-romantic overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-gray-950 rounded-b-3xl z-20" />

                <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
                  <div className="h-10 w-full absolute top-0 z-10 flex justify-between px-8 items-center text-[11px] font-medium text-black/40">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-black/20 rounded-sm" />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTheme.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="relative h-[58%] w-full"
                    >
                      <Image
                        src={activeTheme.image}
                        alt={activeTheme.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  <motion.div 
                    layout
                    className="flex-1 p-6 flex flex-col items-center text-center pt-6 relative"
                    style={{ backgroundColor: activeTheme.color }}
                  >
                    <div className="absolute -top-6 left-0 right-0 h-6 rounded-t-[2rem]" style={{ backgroundColor: activeTheme.color }} />
                    
                    <motion.p 
                      layout
                      className="text-sm font-serif italic text-gray-500"
                    >
                      우리의 시작
                    </motion.p>
                    <motion.h3 
                      layout
                      className="text-2xl font-display text-gray-800 leading-tight mt-1"
                    >
                      민영 & 지훈
                    </motion.h3>
                    <motion.p 
                      layout
                      className="text-xs text-gray-500 font-medium tracking-wider mt-2"
                    >
                      2026년 10월 26일 토요일
                    </motion.p>

                    <motion.div layout className="mt-5 w-full space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="w-full h-11 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all"
                        style={{ backgroundColor: activeTheme.accent }}
                      >
                        <span className="text-brown-900">참석 여부 알리기</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="absolute top-28 -left-[9px] w-[9px] h-12 bg-gray-800 rounded-l-md" />
                <div className="absolute top-44 -left-[9px] w-[9px] h-16 bg-gray-800 rounded-l-md" />
                <div className="absolute top-32 -right-[9px] w-[9px] h-24 bg-gray-800 rounded-r-md" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              {activeTheme.emoji}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-lg"
          >
            <h3 className="text-3xl font-display text-brown-900 mb-8 flex items-center gap-3">
              테마 선택
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🎨
              </motion.span>
            </h3>

            <div className="space-y-4">
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTheme(theme)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-5 text-left relative overflow-hidden ${
                    activeTheme.id === theme.id
                      ? "border-coral-400 bg-gradient-to-r from-coral-50 to-rose-light shadow-dreamy"
                      : "border-gray-100 bg-white/80 backdrop-blur-sm hover:border-coral-200 hover:shadow-soft"
                  }`}
                >
                  <motion.div
                    animate={activeTheme.id === theme.id ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-soft"
                    style={{ backgroundColor: theme.color }}
                  >
                    {theme.emoji}
                  </motion.div>

                  <div className="flex-1">
                    <p className="font-display text-lg text-brown-900">{theme.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{theme.description}</p>
                  </div>

                  <AnimatePresence>
                    {activeTheme.id === theme.id && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-coral-100 shadow-dreamy relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-coral-100/50 to-transparent"
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <p className="font-display text-brown-900">50개 이상의 프리미엄 테마</p>
                    <p className="text-sm text-gray-500">더 많은 스타일이 기다리고 있어요</p>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-400 text-white rounded-full font-medium text-lg shadow-lg shadow-coral-500/25 btn-romantic"
                >
                  모든 테마 둘러보기 →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
