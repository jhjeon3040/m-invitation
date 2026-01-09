"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Palette,
  Film,
  Sparkles,
  Monitor,
  Heart,
  BarChart3,
  Link2,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "나만의 무드",
    description: "글꼴부터 질감까지, 취향대로 고르세요.",
  },
  {
    icon: Film,
    title: "영화 같은 몰입감",
    description: "스크롤할 때마다 펼쳐지는 감동적인 서사.",
  },
  {
    icon: Sparkles,
    title: "마음을 담은 문장",
    description: "어떤 말을 써야 할지 고민하지 마세요. AI가 당신의 진심을 문장으로 다듬어드립니다.",
  },
  {
    icon: Monitor,
    title: "예식의 품격",
    description: "식전, 스크린에 띄워지는 아름다운 환영 인사.",
  },
  {
    icon: Heart,
    title: "숨겨둔 진심",
    description: "소중한 사람들에게만 전하는 특별한 메시지.",
    isHighlight: true,
  },
  {
    icon: BarChart3,
    title: "데이터로 보는 관심",
    description: "하객들의 반응과 참석 여부를 한눈에.",
  },
  {
    icon: Link2,
    title: "간결한 주소",
    description: "공유하기 좋고 기억하기 쉬운 나만의 링크.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-32 md:py-40 px-5 bg-gradient-dreamy"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage-light)] rounded-full text-sm text-[var(--color-brown-700)] mb-6">
            Why Yeonjeong
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brown-900)] mb-4 leading-tight">
            디테일의 차이가
            <br />
            품격을 만듭니다
          </h2>
          <p className="text-[var(--color-brown-500)] text-lg max-w-md mx-auto">
            작은 부분까지 놓치지 않는 섬세함으로 가장 나다운 청첩장을 완성해보세요.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`group relative p-8 md:p-10 rounded-2xl border transition-all duration-200 ${
                feature.isHighlight
                  ? "bg-gradient-to-br from-[var(--color-coral-500)] to-[var(--color-rose-soft)] border-[var(--color-coral-400)] sm:col-span-2 lg:col-span-1 glow-rose"
                  : "card-romantic border-[var(--color-coral-400)] border-opacity-20 hover:border-opacity-100 hover-lift hover-glow"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:animate-bounce-soft transition-all ${
                  feature.isHighlight
                    ? "bg-white/10"
                    : "bg-[var(--color-peach-light)]"
                }`}
              >
                <feature.icon
                  className={`w-6 h-6 transition-colors ${
                    feature.isHighlight ? "text-white" : "text-[var(--color-coral-500)]"
                  }`}
                  strokeWidth={1.5}
                />
              </div>

              <h3
                className={`text-lg font-semibold mb-2 ${
                  feature.isHighlight ? "text-white" : "text-[var(--color-brown-900)]"
                }`}
              >
                {feature.title}
              </h3>

              <p
                className={`text-sm leading-relaxed ${
                  feature.isHighlight ? "text-white/70" : "text-[var(--color-brown-500)]"
                }`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
