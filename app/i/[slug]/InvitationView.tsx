"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { KakaoMap } from "@/components/map/KakaoMap";
import { openKakaoMap, openNaverMap, openTMap, copyAddress } from "@/lib/navigation";

interface Invitation {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  venueFloor?: string;
  venueLat?: number;
  venueLng?: number;
  message: string;
  theme: string;
  rsvpEnabled: boolean;
  guestbookEnabled: boolean;
  coverImage: string;
  gallery: string[];
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  isSecret: boolean;
  createdAt: string;
}

export function InvitationView({ invitation }: { invitation: Invitation }) {
  const weddingDate = new Date(invitation.weddingDate);
  const daysUntil = Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const formattedDate = weddingDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-cream-bg">
      <HeroSection invitation={invitation} formattedDate={formattedDate} daysUntil={daysUntil} />
      <InvitationSection invitation={invitation} />
      <GallerySection images={invitation.gallery} />
      <LocationSection invitation={invitation} />
      {invitation.rsvpEnabled && <RsvpSection invitation={invitation} />}
      {invitation.guestbookEnabled && <GuestbookSection slug={invitation.slug} />}
      <FooterSection invitation={invitation} />
    </div>
  );
}

function HeroSection({ invitation, formattedDate, daysUntil }: { invitation: Invitation; formattedDate: string; daysUntil: number }) {
  return (
    <section className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <Image
          src={invitation.coverImage}
          alt="Wedding Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-end pb-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-80">Wedding Invitation</p>
          <h1 className="text-4xl font-display mb-2">
            {invitation.brideName} <span className="text-rose-300">♥</span> {invitation.groomName}
          </h1>
          <p className="text-lg font-serif italic opacity-90 mb-6">{formattedDate}</p>
          <p className="text-sm opacity-80">{invitation.venueName}</p>
          {daysUntil > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm">D-{daysUntil}</span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function InvitationSection({ invitation }: { invitation: Invitation }) {
  return (
    <section className="py-20 px-6 text-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        <p className="text-coral-500 text-sm tracking-widest mb-8">INVITATION</p>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-12">
          {invitation.message}
        </p>

        <div className="flex justify-center gap-12 text-sm">
          <div>
            <p className="text-gray-400 mb-2">신랑 측</p>
            <p className="text-gray-700">
              {invitation.groomFather} · {invitation.groomMother}
              <span className="text-gray-400 ml-1">의 아들</span> {invitation.groomName}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">신부 측</p>
            <p className="text-gray-700">
              {invitation.brideFather} · {invitation.brideMother}
              <span className="text-gray-400 ml-1">의 딸</span> {invitation.brideName}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function GallerySection({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-cream-bg">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-coral-500 text-sm tracking-widest text-center mb-8">GALLERY</p>

        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedImage(i)}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl">&times;</button>
          <Image
            src={images[selectedImage]}
            alt="Selected"
            width={800}
            height={800}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      )}
    </section>
  );
}

function LocationSection({ invitation }: { invitation: Invitation }) {
  const hasCoordinates = invitation.venueLat && invitation.venueLng;
  
  const navigationParams = {
    lat: invitation.venueLat || 0,
    lng: invitation.venueLng || 0,
    name: invitation.venueName,
  };

  const handleCopyAddress = async () => {
    const success = await copyAddress(invitation.venueAddress, invitation.venueName);
    if (success) {
      toast.success("주소가 복사되었습니다");
    } else {
      toast.error("주소 복사에 실패했습니다");
    }
  };

  return (
    <section className="py-16 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto text-center"
      >
        <p className="text-coral-500 text-sm tracking-widest mb-8">LOCATION</p>

        <h3 className="text-xl font-display text-brown-900 mb-2">{invitation.venueName}</h3>
        {invitation.venueFloor && <p className="text-gray-500 mb-2">{invitation.venueFloor}</p>}
        <p className="text-gray-600 text-sm mb-6">{invitation.venueAddress}</p>

        {hasCoordinates ? (
          <KakaoMap
            lat={invitation.venueLat!}
            lng={invitation.venueLng!}
            venueName={invitation.venueName}
            venueAddress={invitation.venueAddress}
            className="w-full h-64 rounded-xl mb-6"
          />
        ) : (
          <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">{invitation.venueName}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {hasCoordinates && (
            <>
              <button
                onClick={() => openKakaoMap(navigationParams)}
                className="px-4 py-2 bg-yellow-400 text-brown-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors"
              >
                카카오맵
              </button>
              <button
                onClick={() => openNaverMap(navigationParams)}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                네이버지도
              </button>
              <button
                onClick={() => openTMap(navigationParams)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                T맵
              </button>
            </>
          )}
          <button
            onClick={handleCopyAddress}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            주소복사
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function RsvpSection({ invitation }: { invitation: Invitation }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attending: true,
    mealCount: 1,
    side: "groom" as "groom" | "bride",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("성함을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/i/${invitation.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || undefined,
          attending: formData.attending,
          mealCount: formData.attending ? formData.mealCount : 0,
          side: formData.side,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "참석 여부 전달에 실패했습니다");
      }

      setIsSubmitted(true);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-6 bg-rose-light/30">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl mb-4"
          >
            💌
          </motion.div>
          <h3 className="text-xl font-display text-brown-900 mb-2">감사합니다!</h3>
          <p className="text-gray-600">참석 여부가 전달되었습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-rose-light/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        <p className="text-coral-500 text-sm tracking-widest text-center mb-8">RSVP</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">성함</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400"
              placeholder="성함을 입력해주세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">연락처 (선택)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">참석 여부</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: true })}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  formData.attending ? "border-coral-400 bg-coral-50 text-coral-600" : "border-gray-200 text-gray-600"
                }`}
              >
                참석합니다
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: false, mealCount: 0 })}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  !formData.attending ? "border-coral-400 bg-coral-50 text-coral-600" : "border-gray-200 text-gray-600"
                }`}
              >
                마음만 전합니다
              </button>
            </div>
          </div>

          {formData.attending && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">식사 인원</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mealCount: Math.max(1, formData.mealCount - 1) })}
                  className="w-10 h-10 rounded-full border border-gray-200 text-gray-600"
                >
                  -
                </button>
                <span className="text-xl font-medium w-8 text-center">{formData.mealCount}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mealCount: formData.mealCount + 1 })}
                  className="w-10 h-10 rounded-full border border-gray-200 text-gray-600"
                >
                  +
                </button>
                <span className="text-gray-500 text-sm">명</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">누구의 하객인가요?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, side: "groom" })}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  formData.side === "groom" ? "border-coral-400 bg-coral-50 text-coral-600" : "border-gray-200 text-gray-600"
                }`}
              >
                신랑측
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, side: "bride" })}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  formData.side === "bride" ? "border-coral-400 bg-coral-50 text-coral-600" : "border-gray-200 text-gray-600"
                }`}
              >
                신부측
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-coral-500 text-white font-medium rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "전달 중..." : "전달하기"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

function GuestbookSection({ slug }: { slug: string }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({ name: "", password: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/i/${slug}/guestbook`);
      if (response.ok) {
        const result = await response.json();
        setEntries(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch guestbook:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.name.trim() || !newMessage.password.trim() || !newMessage.message.trim()) {
      toast.error("모든 항목을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/i/${slug}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "방명록 등록에 실패했습니다");
      }

      toast.success("방명록이 등록되었습니다");
      setNewMessage({ name: "", password: "", message: "" });
      fetchEntries();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <section className="py-16 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        <p className="text-coral-500 text-sm tracking-widest text-center mb-8">GUESTBOOK</p>

        <div className="space-y-4 mb-8">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-coral-400 border-t-transparent rounded-full mx-auto mb-2" />
              불러오는 중...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              첫 번째 축하 메시지를 남겨주세요!
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-cream-bg rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brown-900">{entry.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="text-gray-600 text-sm">{entry.message}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              required
              value={newMessage.name}
              onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
              placeholder="이름"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-coral-400"
            />
            <input
              type="password"
              required
              value={newMessage.password}
              onChange={(e) => setNewMessage({ ...newMessage, password: e.target.value })}
              placeholder="비밀번호"
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-coral-400"
            />
          </div>
          <textarea
            required
            value={newMessage.message}
            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
            placeholder="축하 메시지를 남겨주세요"
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-coral-400"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-coral-500 text-white text-sm font-medium rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

function FooterSection({ invitation }: { invitation: Invitation }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${invitation.brideName} ♥ ${invitation.groomName} 결혼합니다`,
        url: window.location.href,
      });
    }
  };

  const handleCopyLink = async () => {
    const success = await copyAddress(window.location.href);
    if (success) {
      toast.success("링크가 복사되었습니다");
    } else {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  return (
    <section className="py-12 px-6 bg-cream-bg border-t border-gray-100">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-yellow-400 text-brown-900 rounded-xl text-sm font-medium"
          >
            카카오톡 공유
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium"
          >
            링크 복사
          </button>
        </div>

        <Link href="/" className="text-xs text-gray-400 hover:text-coral-500 transition-colors">
          Made with 💕 by 연정
        </Link>
      </div>
    </section>
  );
}
