"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

const FloatingSparkle = ({ delay, left, top }: { delay: number; left: string; top: string }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      opacity: [0, 0.8, 0],
      rotate: [0, 180]
    }}
    transition={{ 
      duration: 3,
      delay,
      repeat: Infinity,
      repeatDelay: 2
    }}
    className="absolute pointer-events-none"
    style={{ left, top }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="rgba(255, 142, 118, 0.5)"/>
    </svg>
  </motion.div>
);

const FloatingHeart = ({ delay, right, bottom, size }: { delay: number; right: string; bottom: string; size: number }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [-20, -80],
      opacity: [0, 0.6, 0],
      rotate: [0, 15, -15, 0],
      scale: [0.8, 1, 0.8]
    }}
    transition={{ 
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none text-rose-300/50"
    style={{ right, bottom, fontSize: size }}
  >
    💕
  </motion.div>
);

const testimonials = [
  {
    id: 1,
    quote: "하객들이 '이런 청첩장 처음 봤다'며 감탄했어요. AI가 써준 초대글이 정말 우리 이야기 같았어요.",
    couple: "민영 & 지훈",
    date: "2025년 5월",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    accent: "from-coral-400/20 to-rose-300/20",
  },
  {
    id: 2,
    quote: "예식장 스크린에 라이브 모드로 띄워놨더니 다들 신기해하더라고요. 방명록이 실시간으로 올라오는 게 너무 좋았어요.",
    couple: "수진 & 현우",
    date: "2025년 3월",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=200&auto=format&fit=crop",
    accent: "from-peach-soft/30 to-coral-300/20",
  },
  {
    id: 3,
    quote: "친구들한테만 보여주는 시크릿 영상 기능이 최고였어요! B컷 사진이랑 같이 넣었더니 반응이 폭발적이었어요.",
    couple: "유나 & 성민",
    date: "2025년 4월",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=200&auto=format&fit=crop",
    accent: "from-sage-light/30 to-peach-light/20",
  },
];

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream-bg to-peach-light/30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-coral-200/30 to-rose-soft/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-peach-soft/30 to-sage-light/20 rounded-full blur-3xl"
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingSparkle delay={0} left="5%" top="20%" />
        <FloatingSparkle delay={1.5} left="90%" top="15%" />
        <FloatingSparkle delay={3} left="15%" top="70%" />
        <FloatingSparkle delay={4.5} left="85%" top="60%" />
        <FloatingHeart delay={0} right="10%" bottom="30%" size={24} />
        <FloatingHeart delay={2} right="80%" bottom="20%" size={20} />
        <FloatingHeart delay={4} right="50%" bottom="10%" size={22} />
      </div>

      <div className="absolute top-20 left-10 hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border border-dashed border-coral-200/40 rounded-full"
        />
      </div>
      <div className="absolute bottom-32 right-16 hidden lg:block">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-16 h-16 border-2 border-rose-200/30 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-dreamy border border-coral-100"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg"
            >
              💬
            </motion.span>
            <span className="text-coral-600 font-medium text-sm tracking-wide">Testimonials</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display text-brown-900 mt-6 mb-6"
          >
            실제 커플들의{" "}
            <span className="relative inline-block">
              <span className="text-gradient-coral">이야기</span>
              <motion.svg 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-1 left-0 w-full h-3 text-coral-300/50" 
                viewBox="0 0 100 10" 
                preserveAspectRatio="none"
              >
                <motion.path 
                  d="M0 5 Q 25 10 50 5 T 100 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                />
              </motion.svg>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-lg"
          >
            연정과 함께한 특별한 순간들
          </motion.p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <motion.div 
                className={`absolute -inset-1 bg-gradient-to-br ${testimonial.accent} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 h-full flex flex-col border border-white/50 shadow-dreamy group-hover:shadow-romantic transition-all duration-500">
                <div className="mb-6">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="inline-block"
                  >
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                    >
                      <defs>
                        <linearGradient id={`quoteGradient-${testimonial.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF8E76" />
                          <stop offset="100%" stopColor="#FFB6C1" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" 
                        fill={`url(#quoteGradient-${testimonial.id})`}
                      />
                    </svg>
                  </motion.div>
                </div>

                <p className="text-brown-900 text-lg leading-relaxed flex-1 mb-8 group-hover:text-brown-800 transition-colors">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-coral-300 to-rose-300 rounded-full opacity-50 group-hover:opacity-80 blur-sm transition-opacity" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.couple}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                  <div>
                    <p className="font-medium text-brown-900 group-hover:text-coral-600 transition-colors">
                      {testimonial.couple}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <div className="relative">
                  <motion.div 
                    className={`absolute -inset-1 bg-gradient-to-br ${testimonials[activeIndex].accent} rounded-[2rem] blur-xl opacity-50`}
                  />
                  
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 flex flex-col border border-white/50 shadow-dreamy">
                    <div className="mb-6">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient id="quoteGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF8E76" />
                            <stop offset="100%" stopColor="#FFB6C1" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" 
                          fill="url(#quoteGradientMobile)"
                        />
                      </svg>
                    </div>

                    <p className="text-brown-900 text-lg leading-relaxed flex-1 mb-8">
                      &ldquo;{testimonials[activeIndex].quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-coral-300 to-rose-300 rounded-full opacity-60 blur-sm" />
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                          <Image
                            src={testimonials[activeIndex].image}
                            alt={testimonials[activeIndex].couple}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-brown-900">
                          {testimonials[activeIndex].couple}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonials[activeIndex].date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <motion.div
                  animate={activeIndex === index ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: activeIndex === index ? Infinity : 0 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-gradient-to-r from-coral-500 to-coral-400 shadow-lg shadow-coral-500/50"
                      : "bg-gray-300 hover:bg-coral-300"
                  }`}
                />
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -inset-1 bg-coral-400/30 rounded-full blur-sm"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-coral-600 font-medium rounded-full border border-coral-200 hover:border-coral-400 hover:bg-white transition-all duration-300 shadow-dreamy hover:shadow-romantic"
          >
            <span>더 많은 후기 보기</span>
            <motion.svg 
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
