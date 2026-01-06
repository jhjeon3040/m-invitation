"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-void-black flex items-center justify-center grain-overlay vignette"
    >
      <motion.div
        style={{ y: backgroundY }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0 gpu-accelerate"
      >
        <Image
          src="https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=2000&auto=format&fit=crop"
          alt="Wedding Atmosphere"
          fill
          priority
          className="object-cover opacity-35 grayscale"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-void-black/50 via-transparent to-void-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#191817_70%)]" />

        <div className="absolute inset-0 light-ray pointer-events-none" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full flex flex-col justify-center items-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="inline-block text-champagne-gold font-serif text-xs sm:text-sm tracking-[0.5em] uppercase">
            <span className="inline-block w-8 h-[1px] bg-champagne-gold/50 mr-4 align-middle" />
            Est. 2026 Atelier
            <span className="inline-block w-8 h-[1px] bg-champagne-gold/50 ml-4 align-middle" />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20"
        >
          <h1 className="text-7xl sm:text-9xl lg:text-[12rem] font-serif italic leading-[0.9] tracking-tight">
            <span className="text-shimmer-subtle">Blanc</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent mx-auto mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="text-base sm:text-xl font-sans font-extralight text-gray-400 tracking-[0.3em] mt-4 uppercase"
          >
            Collection
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-lg mx-auto"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 48 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="w-[1px] bg-gradient-to-b from-transparent via-champagne-gold/30 to-transparent mb-8"
            />

            <p className="text-lg sm:text-xl font-serif-thin text-gray-300 leading-relaxed tracking-wide italic">
              &ldquo;We weave light and silence into your beginning.&rdquo;
            </p>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 2.8 }}
              className="text-sm font-sans text-gray-500 tracking-[0.2em] mt-4 block uppercase"
            >
              당신의 가장 고요하고 완벽한 시작
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-500 tracking-[0.3em] uppercase">
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-champagne-gold/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
