"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "Minimal Eternal",
    desc: "순백의 여백과 고결한 약속",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
    accent: "#F5F5F5",
  },
  {
    id: 2,
    title: "Royal Heritage",
    desc: "전통의 가치와 현대적 우아함",
    img: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800&auto=format&fit=crop",
    accent: "#1A237E",
  },
  {
    id: 3,
    title: "Nature's Whisper",
    desc: "숲의 고요함 속에서 피어난 사랑",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
    accent: "#2E7D32",
  },
  {
    id: 4,
    title: "Urban Cinema",
    desc: "도시의 불빛 아래 펼쳐지는 영화",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    accent: "#37474F",
  },
];

export function CollectionSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);

  return (
    <section
      ref={targetRef}
      className="relative h-[300vh] bg-paper-white text-void-black"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-16 left-8 sm:left-16 z-20 max-w-md"
        >
          <span className="text-champagne-gold font-sans text-xs tracking-[0.3em] uppercase mb-4 block">
            Our Collections
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif italic text-charcoal-gray mb-6 leading-[1.1]">
            The Collection
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-champagne-gold to-transparent mb-6" />
          <p className="font-serif-thin text-xl text-gray-500 leading-relaxed">
            단순한 템플릿이 아닙니다.
            <br />
            <span className="text-charcoal-gray">
              당신의 취향을 증명하는 오브제입니다.
            </span>
          </p>
        </motion.div>

        <motion.div
          style={{ x }}
          className="flex gap-6 sm:gap-12 pl-8 sm:pl-16 items-center h-[65vh] mt-8"
        >
          {collections.map((item, index) => {
            const isHovered = hoveredId === item.id;
            const isOtherHovered = hoveredId !== null && hoveredId !== item.id;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                animate={{
                  scale: isHovered ? 1.02 : isOtherHovered ? 0.95 : 1,
                  opacity: isOtherHovered ? 0.4 : 1,
                  filter: isOtherHovered ? "grayscale(100%)" : "grayscale(0%)",
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[75vw] sm:w-[35vw] lg:w-[28vw] flex-shrink-0 cursor-pointer h-full flex flex-col gpu-accelerate"
              >
                <div className="relative flex-1 overflow-hidden bg-gray-100 group">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-1000 group-hover:scale-110"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  />

                  <motion.div
                    initial={{ opacity: 0.15 }}
                    animate={{
                      opacity: isHovered ? 0.9 : 0.15,
                      y: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-6 left-6 font-serif text-7xl sm:text-8xl text-white/90 mix-blend-overlay select-none"
                  >
                    0{index + 1}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 20,
                    }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute bottom-6 left-6 right-6"
                  >
                    <h3 className="text-3xl sm:text-4xl font-serif font-light text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-sans text-white/80 tracking-wide">
                      {item.desc}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.div>
                </div>

                <div className="mt-4 pt-4 border-t border-charcoal-gray/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-sans text-gray-400 tracking-[0.2em] uppercase">
                      Collection No.{index + 1}
                    </span>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: isHovered ? 32 : 0 }}
                      className="h-[1px] bg-champagne-gold"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="w-[20vw] flex-shrink-0 h-full flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full border border-charcoal-gray/20 flex items-center justify-center mx-auto mb-4 group-hover:border-champagne-gold group-hover:bg-champagne-gold/5 transition-all duration-500">
                <svg
                  className="w-6 h-6 text-charcoal-gray/40 group-hover:text-champagne-gold transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
              <p className="text-sm font-serif text-gray-400 group-hover:text-charcoal-gray transition-colors">
                View All
                <br />
                Collections
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-8 sm:left-16 flex items-center gap-4">
          <div className="flex gap-2">
            {collections.map((item) => (
              <motion.div
                key={item.id}
                animate={{
                  width: hoveredId === item.id ? 24 : 8,
                  backgroundColor:
                    hoveredId === item.id ? "#C5A059" : "#D1D5DB",
                }}
                className="h-2 rounded-full transition-colors"
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-sans tracking-wider">
            {hoveredId ? `0${hoveredId}` : "01"} / 04
          </span>
        </div>
      </div>
    </section>
  );
}
