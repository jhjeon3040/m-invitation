"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "청첩장 하나에도 정성이 느껴진다고 하더라고요. AI가 다듬어준 문장 덕분에 마음을 더 잘 전할 수 있었습니다.",
    couple: "민영 & 지훈",
    date: "2025년 5월",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    quote: "예식장 스크린에 띄운 라이브 모드가 분위기를 한층 더해줬어요. 하객들이 남긴 축하 메시지를 보는 재미도 쏠쏠했고요.",
    couple: "수진 & 현우",
    date: "2025년 3월",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    quote: "가까운 지인들에게만 보여주는 영상 편지가 정말 반응이 좋았어요. 사소한 부분까지 배려한 기능들이 마음에 들었습니다.",
    couple: "유나 & 성민",
    date: "2025년 4월",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=200&auto=format&fit=crop",
  },
];

export function TestimonialSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-32 md:py-40 px-5 bg-white bg-noise"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-rose-light)] rounded-full text-sm text-[var(--color-brown-700)] mb-6">
            Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brown-900)] mb-4">
            먼저 경험한 분들의 이야기
          </h2>
          <p className="text-[var(--color-brown-500)] text-lg">
            연정을 통해 전해진 진심을 확인해보세요.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-[var(--color-rose-light)] to-[var(--color-peach-soft)] glass-card rounded-2xl p-8 md:p-10 flex flex-col hover-lift border border-[var(--color-coral-400)] border-opacity-20"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-[var(--color-coral-500)] rounded-xl flex items-center justify-center mb-5 glow-coral-sm">
                <Quote className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>

              {/* Quote Text */}
              <p className="text-[var(--color-brown-900)] text-base leading-relaxed flex-1 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[var(--color-coral-400)]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.couple}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-brown-900)]">{testimonial.couple}</p>
                  <p className="text-sm text-[var(--color-brown-700)]">{testimonial.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Reviews CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="px-6 py-3 bg-white border border-[var(--color-coral-400)] rounded-xl text-[var(--color-coral-500)] font-medium hover:bg-[var(--color-rose-light)] transition-all">
            후기 더 보기
          </button>
        </motion.div>
      </div>
    </section>
  );
}
