"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { PhoneMockup } from "./PhoneMockup";

const FloatingPetal = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <motion.div
    initial={{ y: -100, x: 0, rotate: 0, opacity: 0 }}
    animate={{ 
      y: ["0vh", "110vh"],
      x: [0, 50, -30, 70, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 1, 0]
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
    className="absolute pointer-events-none"
    style={{ left }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2C12 2 14 6 14 10C14 14 12 22 12 22C12 22 10 14 10 10C10 6 12 2 12 2Z" 
        fill="rgba(255, 182, 193, 0.6)"
      />
      <path 
        d="M2 12C2 12 6 10 10 10C14 10 22 12 22 12C22 12 14 14 10 14C6 14 2 12 2 12Z" 
        fill="rgba(255, 218, 185, 0.5)"
      />
    </svg>
  </motion.div>
);

const Sparkle = ({ delay, left, top }: { delay: number; left: string; top: string }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      rotate: [0, 180]
    }}
    transition={{ 
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: 3
    }}
    className="absolute pointer-events-none"
    style={{ left, top }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="rgba(255, 142, 118, 0.6)"/>
    </svg>
  </motion.div>
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden pt-24 bg-gradient-dreamy bg-noise"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-coral-400/20 to-rose-soft/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-peach-soft/40 to-rose-light/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-sage-green/20 to-sage-light/30 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingPetal delay={0} duration={15} left="10%" size={24} />
        <FloatingPetal delay={2} duration={18} left="25%" size={20} />
        <FloatingPetal delay={4} duration={20} left="40%" size={28} />
        <FloatingPetal delay={6} duration={16} left="60%" size={22} />
        <FloatingPetal delay={8} duration={22} left="75%" size={26} />
        <FloatingPetal delay={10} duration={17} left="90%" size={20} />
        
        <Sparkle delay={0} left="15%" top="20%" />
        <Sparkle delay={1.5} left="80%" top="30%" />
        <Sparkle delay={3} left="50%" top="15%" />
        <Sparkle delay={4.5} left="30%" top="60%" />
        <Sparkle delay={6} left="70%" top="70%" />
      </div>

      <div className="absolute top-32 left-8 hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border border-dashed border-coral-300/30 rounded-full"
        />
      </div>
      <div className="absolute bottom-40 right-16 hidden lg:block">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 border-2 border-sage-green/20 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center relative z-10 pt-10 lg:pt-0">
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left mb-16 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 text-coral-600 font-medium tracking-wide text-sm bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-dreamy border border-coral-100"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-coral-500 rounded-full"
              />
              프리미엄 모바일 청첩장
            </motion.span>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display text-brown-900 leading-[1.1]">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                <span className="text-gradient-coral">연정</span>
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-3xl sm:text-4xl lg:text-5xl font-serif italic text-coral-500 mt-3 relative"
              >
                사랑의 시작을 담다
                <motion.svg 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -bottom-2 left-0 w-full h-3 text-coral-300/50" 
                  viewBox="0 0 200 10" 
                  preserveAspectRatio="none"
                >
                  <motion.path 
                    d="M0 5 Q 50 10 100 5 T 200 5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </motion.svg>
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-600 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              소중한 순간을 가장 아름답게 전하세요.
              <br className="hidden sm:block" />
              <span className="text-coral-500 font-medium">AI가 만드는 감성 초대글</span>부터 하객 인사이트까지.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <Link href="/login">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-coral-500 to-coral-400 text-white text-lg font-medium rounded-full overflow-hidden btn-romantic glow-coral cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  무료로 시작하기
                  <motion.svg 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.div>
            </Link>
            <Link href="/demo/journey">
              <motion.div 
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 142, 118, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white/80 backdrop-blur-sm text-brown-900 text-lg font-medium rounded-full border border-coral-200 hover:border-coral-300 transition-all duration-300 shadow-dreamy cursor-pointer"
              >
                샘플 둘러보기
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center lg:justify-start gap-8 pt-6"
          >
            {[
              { text: "3분 만에 완성", icon: "⚡" },
              { text: "모든 기능 무료", icon: "✨" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className="text-lg"
                >
                  {item.icon}
                </motion.span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: phoneY }}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center lg:justify-end"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 lg:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-peach-soft via-rose-light to-sage-light rounded-full -z-10 blur-sm opacity-80"
          />

          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 lg:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-dashed border-coral-200/30 rounded-full -z-10"
          />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-8, -12, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 lg:left-auto lg:right-[180px] top-8 -translate-x-2/3 lg:translate-x-0 z-0"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-coral-200/30 to-rose-soft/20 rounded-[3rem] blur-xl" />
              <PhoneMockup
                imageSrc="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                name="수진 & 현우"
                date="2026년 5월 16일"
                className="scale-[0.85] opacity-90"
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], rotate: [6, 3, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            whileHover={{ scale: 1.08, rotate: 0 }}
            className="absolute left-1/2 lg:left-auto lg:right-[50px] top-20 -translate-x-1/3 lg:translate-x-0 z-10 cursor-pointer"
          >
            <div className="relative">
              <motion.div 
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-6 bg-gradient-to-br from-coral-300/40 to-peach-soft/30 rounded-[3rem] blur-2xl" 
              />
              <PhoneMockup
                imageSrc="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop"
                name="민영 & 지훈"
                date="2026년 10월 26일"
                className="shadow-romantic"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(150%+1.3px)] h-[120px] sm:h-[180px]"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFF8F6" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-8 bg-gradient-to-b from-coral-300 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
