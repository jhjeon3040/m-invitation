"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ 
      y: [-20, -100, -20],
      opacity: [0, 1, 0],
      rotate: [0, 10, -10, 0],
      scale: [0.8, 1, 0.8]
    }}
    transition={{ 
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none text-coral-300/60"
    style={{ left, fontSize: size }}
  >
    💕
  </motion.div>
);

const benefits = [
  { icon: "💳", text: "신용카드 불필요" },
  { icon: "⚡", text: "3분 만에 완성" },
  { icon: "🔄", text: "언제든 취소 가능" },
];

export function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section 
      ref={sectionRef}
      className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-peach-light to-rose-light" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-coral-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-rose-soft/30 rounded-full blur-3xl"
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingHeart delay={0} left="10%" size={24} />
        <FloatingHeart delay={1} left="25%" size={20} />
        <FloatingHeart delay={2} left="50%" size={28} />
        <FloatingHeart delay={3} left="70%" size={22} />
        <FloatingHeart delay={4} left="85%" size={26} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-dreamy"
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              💌
            </motion.span>
            <span className="text-coral-600 font-medium">지금 바로 시작하세요</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-brown-900 leading-tight">
            당신의 사랑 이야기를
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative inline-block"
            >
              <span className="text-gradient-coral">가장 아름답게</span>
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute -bottom-2 left-0 w-full h-4 text-coral-300/50" 
                viewBox="0 0 200 15" 
                preserveAspectRatio="none"
              >
                <motion.path 
                  d="M0 10 Q 50 0 100 10 T 200 10" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none"
                />
              </motion.svg>
            </motion.span>
            {" "}전하세요
          </h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            지금 시작하면 <span className="text-coral-500 font-semibold">3분</span> 만에 완성할 수 있어요.
            <br />
            모든 기능을 <span className="text-coral-500 font-semibold">무료</span>로 체험해보세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-12 py-6 bg-gradient-to-r from-coral-500 to-coral-400 text-white text-xl font-medium rounded-full overflow-hidden shadow-2xl shadow-coral-500/30"
            >
              <motion.span
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                무료로 시작하기
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-6 bg-white/80 backdrop-blur-sm text-brown-900 text-xl font-medium rounded-full border-2 border-coral-200 hover:border-coral-400 hover:bg-white transition-all duration-300 shadow-lg"
            >
              1:1 문의하기
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full shadow-soft"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="text-xl"
                >
                  {benefit.icon}
                </motion.span>
                <span className="text-gray-700 font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
            className="pt-12"
          >
            <p className="text-sm text-gray-400">
              이미 <span className="text-coral-500 font-semibold">10,000+</span> 커플이 연정과 함께했어요
            </p>
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
