"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function QuickSetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    weddingDate: "",
    weddingTime: "14:00",
    venueName: "",
    venueAddress: "",
    groomName: "",
    brideName: "",
  });

  const isValid =
    formData.weddingDate &&
    formData.venueName &&
    formData.groomName.length >= 2 &&
    formData.brideName.length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invitation");
      }

      const { invitation } = await response.json();
      router.push(`/editor/${invitation.id}`);
    } catch (error) {
      console.error(error);
      alert("청첩장 생성에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dreamy flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-3xl font-display font-bold text-brown-900">연정</span>
            <span className="text-coral-500 text-3xl">.</span>
          </Link>
          <h1 className="text-2xl font-display text-brown-900 mb-2">
            딱 3가지만 알려주세요
          </h1>
          <p className="text-gray-500">나머지는 나중에 천천히 꾸미면 돼요</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-dreamy border border-white/50"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                예식일 <span className="text-coral-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
                <select
                  value={formData.weddingTime}
                  onChange={(e) => setFormData({ ...formData, weddingTime: e.target.value })}
                  className="w-28 px-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                      {i.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                예식장 <span className="text-coral-500">*</span>
              </label>
              <input
                type="text"
                placeholder="예식장 이름"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all mb-2"
              />
              <input
                type="text"
                placeholder="주소 (선택)"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                신랑 & 신부 <span className="text-coral-500">*</span>
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="신랑 이름"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    maxLength={10}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                  />
                </div>
                <span className="flex items-center text-coral-400 text-xl">♥</span>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="신부 이름"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    maxLength={10}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!isValid || isSubmitting}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className="w-full mt-8 py-4 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-coral-500/25"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                만들고 있어요...
              </span>
            ) : (
              "청첩장 만들기 →"
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-400 mt-4">
            💡 테마, 사진, 초대글은 나중에 추가할 수 있어요
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
