"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-8xl mb-8"
      >
        💌
      </motion.div>

      <h2 className="text-2xl font-display text-brown-900 mb-3 text-center">
        아직 청첩장이 없어요
      </h2>
      <p className="text-gray-500 text-center max-w-sm mb-8">
        지금 바로 당신만의 특별한 청첩장을 만들어보세요.
        <br />
        3분이면 완성할 수 있어요!
      </p>

      <Link
        href="/editor/new"
        className="group relative px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-400 text-white rounded-full font-medium overflow-hidden shadow-lg shadow-coral-500/25"
      >
        <motion.span
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        <span className="relative flex items-center gap-2">
          청첩장 만들기
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </Link>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {[
          { icon: "⚡", title: "3분 만에 완성", desc: "쉽고 빠른 편집" },
          { icon: "🎨", title: "50+ 프리미엄 테마", desc: "세련된 디자인" },
          { icon: "✨", title: "AI 초대글", desc: "감성적인 문구 추천" },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-100"
          >
            <span className="text-3xl block mb-2">{feature.icon}</span>
            <h3 className="font-medium text-brown-900 text-sm">{feature.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
