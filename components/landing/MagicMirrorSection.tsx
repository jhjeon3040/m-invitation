"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

export function MagicMirrorSection() {
  const [isHovering, setIsHovering] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setHasDropped(true);
    }, 2500);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasDropped(true);
    }, 2500);
  };

  return (
    <section className="relative w-full min-h-screen bg-paper-white flex flex-col items-center justify-center py-24 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FFFFFF_0%,_#F4F3F0_100%)]" />
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 text-center mb-16 max-w-2xl">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-champagne-gold font-sans text-xs tracking-[0.3em] uppercase mb-6 block"
        >
          Instant Preview
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl font-serif italic text-charcoal-gray mb-6 leading-[1.1]"
        >
          The Magic Mirror
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-champagne-gold to-transparent mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 font-serif-thin text-xl leading-relaxed"
        >
          당신의 사진 한 장이면 충분합니다.
          <br />
          <span className="text-charcoal-gray">
            지금 바로, BLANC의 컬렉션을 입어보세요.
          </span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative w-full max-w-4xl"
      >
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-champagne-gold/40" />
        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-champagne-gold/40" />
        <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-champagne-gold/40" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-champagne-gold/40" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          animate={{
            boxShadow: isHovering
              ? "0 0 60px rgba(197, 160, 89, 0.3), inset 0 0 30px rgba(197, 160, 89, 0.05)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.08), inset 0 0 0 rgba(197, 160, 89, 0)",
          }}
          className={`relative aspect-[16/10] bg-white border transition-all duration-500 flex items-center justify-center overflow-hidden cursor-pointer ${
            isHovering
              ? "border-champagne-gold"
              : "border-gray-200 hover:border-champagne-gold/50"
          }`}
        >
          <AnimatePresence mode="wait">
            {!hasDropped && !isProcessing && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 pointer-events-none p-8"
              >
                <motion.div
                  animate={{
                    scale: isHovering ? 1.1 : 1,
                    borderColor: isHovering ? "#C5A059" : "#E5E7EB",
                  }}
                  className="w-24 h-24 border-2 border-dashed rounded-full mx-auto flex items-center justify-center transition-colors"
                >
                  <motion.svg
                    animate={{ y: isHovering ? -5 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-10 h-10 transition-colors ${
                      isHovering ? "text-champagne-gold" : "text-gray-300"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </motion.svg>
                </motion.div>

                <div>
                  <p className="text-2xl font-serif italic text-charcoal-gray mb-2">
                    가장 아름다운 순간을 이곳에
                  </p>
                  <p className="text-sm text-gray-400 font-sans">
                    드래그하여 놓거나 클릭하여 업로드
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>JPG</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>PNG</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>최대 10MB</span>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-void-black flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{
                          scale: [0, 2.5],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: "easeOut",
                        }}
                        className="absolute inset-0 rounded-full border border-champagne-gold/40"
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-12 h-12 border-t border-champagne-gold rounded-full"
                      />
                    </div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-champagne-gold text-sm tracking-[0.3em] uppercase font-sans"
                  >
                    재단 중...
                  </motion.p>
                  <p className="text-gray-500 text-xs mt-2 font-serif-thin italic">
                    Tailoring your masterpiece
                  </p>
                </div>
              </motion.div>
            )}

            {hasDropped && !isProcessing && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-void-black"
              >
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
                  alt="Preview Background"
                  fill
                  className="object-cover opacity-20"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 rounded-full border border-champagne-gold/50 flex items-center justify-center mx-auto mb-8"
                    >
                      <svg
                        className="w-8 h-8 text-champagne-gold"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>

                    <h3 className="text-4xl sm:text-5xl font-serif italic text-white mb-4">
                      당신만의 작품이
                      <br />
                      완성되었습니다
                    </h3>

                    <p className="text-gray-400 font-sans text-sm tracking-wider mb-10">
                      3가지 컬렉션으로 재단되었습니다
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-12 py-4 bg-transparent border border-champagne-gold/50 text-champagne-gold font-serif italic text-lg overflow-hidden transition-all duration-500 hover:border-champagne-gold"
                    >
                      <span className="relative z-10 group-hover:text-void-black transition-colors duration-500">
                        컬렉션 확인하기
                      </span>
                      <motion.div
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-champagne-gold"
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-gray-400 font-sans tracking-wider"
      >
        업로드된 이미지는 미리보기 용도로만 사용되며 저장되지 않습니다
      </motion.p>
    </section>
  );
}
