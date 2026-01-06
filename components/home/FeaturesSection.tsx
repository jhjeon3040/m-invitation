"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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
    id: 1,
    icon: Palette,
    title: "초개인화",
    subtitle: "Hyper-Personalization",
    description: "타이포, 컬러, 질감까지 나만의 스타일로 세밀하게 커스터마이징하세요.",
    gradient: "from-rose-light via-peach-light to-cream-bg",
    iconBg: "bg-gradient-to-br from-rose-soft to-coral-400",
    decoration: "🎨",
  },
  {
    id: 2,
    icon: Film,
    title: "시네마틱 경험",
    subtitle: "Cinematic Experience",
    description: "Parallax, Fade, BGM 싱크로 영화처럼 감동적인 초대장을 만들어보세요.",
    gradient: "from-sage-light via-cream-bg to-peach-light",
    iconBg: "bg-gradient-to-br from-sage-green to-sage-green/70",
    decoration: "🎬",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "AI 초대글 작성",
    subtitle: "AI Invitation Writer",
    description: "키워드만 입력하면 AI가 당신의 마음을 감성적인 문장으로 표현해드려요.",
    gradient: "from-peach-light via-rose-light to-cream-bg",
    iconBg: "bg-gradient-to-br from-coral-500 to-coral-400",
    decoration: "✨",
  },
  {
    id: 4,
    icon: Monitor,
    title: "라이브 웨딩 모드",
    subtitle: "Live Wedding Mode",
    description: "예식 당일, 웨딩홀 스크린에 띄울 수 있는 디지털 사이니지를 제공해요.",
    gradient: "from-cream-dark via-peach-light to-sage-light",
    iconBg: "bg-gradient-to-br from-brown-700 to-brown-500",
    decoration: "📺",
  },
  {
    id: 5,
    icon: Heart,
    title: "시크릿 영상 편지",
    subtitle: "Hidden Easter Egg",
    description: "특정 사진을 길게 누르면 나타나는 숨겨진 영상 편지. 친한 친구들만을 위한 특별한 선물이에요.",
    isWide: true,
    isAccent: true,
    decoration: "💌",
  },
  {
    id: 6,
    icon: BarChart3,
    title: "하객 인사이트",
    subtitle: "Guest Insight",
    description: "누가 어떤 사진을 오래 봤는지, RSVP 응답률까지 한눈에 확인하세요.",
    gradient: "from-sage-light via-cream-bg to-rose-light",
    iconBg: "bg-gradient-to-br from-sage-green to-sage-green/70",
    decoration: "📊",
  },
  {
    id: 7,
    icon: Link2,
    title: "개인화 URL & QR",
    subtitle: "Personalized URL",
    description: "yeonjeong.kr/우리의이야기 - 기억하기 쉬운 나만의 주소와 QR 코드를 받으세요.",
    gradient: "from-rose-light via-peach-light to-sage-light",
    iconBg: "bg-gradient-to-br from-rose-soft to-coral-400",
    decoration: "🔗",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  if (feature.isAccent) {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="md:col-span-2 relative group"
      >
        <motion.div
          animate={{ 
            scale: isHovered ? 1.02 : 1,
            y: isHovered ? -8 : 0
          }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] p-10 bg-gradient-to-r from-coral-500 via-coral-400 to-rose-soft"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full"
          />
          
          <motion.div
            animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="absolute top-6 right-8 text-5xl opacity-30"
          >
            {feature.decoration}
          </motion.div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <motion.div 
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.4 }}
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <feature.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-3xl font-display text-white">{feature.title}</h3>
                <span className="text-white/60 text-sm font-medium">{feature.subtitle}</span>
              </div>
              <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                {feature.description}
              </p>
            </div>

            <motion.div 
              animate={{ x: isHovered ? 5 : 0 }}
              className="hidden md:flex items-center gap-2 text-white/80 group-hover:text-white cursor-pointer"
            >
              <span className="text-sm font-medium">자세히 보기</span>
              <motion.svg
                animate={{ x: isHovered ? 5 : 0 }}
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
          />
        </motion.div>

        <motion.div
          animate={{ 
            opacity: isHovered ? 0.5 : 0.2,
            scale: isHovered ? 1.05 : 1
          }}
          className="absolute -inset-4 bg-gradient-to-r from-coral-500/30 to-rose-soft/30 rounded-[2.5rem] blur-2xl -z-10"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -8 : 0
        }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br ${feature.gradient} border border-white/50 backdrop-blur-sm h-full`}
      >
        <motion.div
          animate={isHovered ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] } : {}}
          transition={{ duration: 0.6 }}
          className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity"
        >
          {feature.decoration}
        </motion.div>

        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"
        />

        <div className="relative z-10 flex flex-col gap-5">
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -3, 3, 0] : 0
            }}
            transition={{ duration: 0.4 }}
            className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-lg`}
          >
            <feature.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-2xl font-display text-brown-900">{feature.title}</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {feature.subtitle}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : 0 }}
            transition={{ duration: 0.4 }}
            className="h-[2px] bg-gradient-to-r from-coral-400 to-transparent rounded-full"
          />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1 : 0.9
        }}
        className="absolute -inset-3 bg-gradient-to-br from-coral-300/30 to-rose-soft/20 rounded-[2.5rem] blur-xl -z-10"
      />
    </motion.div>
  );
};

export function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={sectionRef} className="py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-coral-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-green/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-coral-500 font-medium text-sm tracking-widest uppercase bg-coral-50 px-6 py-2 rounded-full mb-6"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.span>
            Features
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.span>
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display text-brown-900 mb-6">
            <span className="text-gradient-romantic">연정</span>만의 특별함
          </h2>

          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            단순한 템플릿이 아닌, 당신의 사랑 이야기를 담는
            <br className="hidden sm:block" />
            <span className="text-coral-500">가장 아름다운 방법</span>을 제공합니다.
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-coral-400 to-transparent mx-auto mt-8"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
