"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  groomName: string;
  brideName: string;
}

interface ValidationStatus {
  hasWeddingDate: boolean;
  hasWeddingTime: boolean;
  hasVenue: boolean;
  hasGroomName: boolean;
  hasBrideName: boolean;
  hasPhoto: boolean;
}

export function PublishModal({
  isOpen,
  onClose,
  invitationId,
  groomName,
  brideName,
}: PublishModalProps) {
  const [slug, setSlug] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "valid" | "taken" | "invalid">("idle");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponStatus, setCouponStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [couponError, setCouponError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [validation, setValidation] = useState<ValidationStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadValidation();
      generateSlugSuggestion();
    }
  }, [isOpen, invitationId]);

  async function loadValidation() {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`);
      if (response.ok) {
        const { invitation } = await response.json();
        setValidation({
          hasWeddingDate: !!invitation.weddingDate,
          hasWeddingTime: !!invitation.weddingTime,
          hasVenue: !!invitation.venueName,
          hasGroomName: !!invitation.groomName,
          hasBrideName: !!invitation.brideName,
          hasPhoto: invitation.gallery?.length > 0,
        });
      }
    } catch (error) {
      console.error("Failed to load validation:", error);
    }
  }

  function generateSlugSuggestion() {
    const names = [brideName, groomName].filter(Boolean);
    if (names.length === 2) {
      const suggested = `${names[0]}-${names[1]}`.toLowerCase().replace(/\s+/g, "-");
      setSlug(suggested);
      setSlugStatus("idle");
    }
  }

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugStatus("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingSlug(true);
      try {
        const response = await fetch(`/api/invitations?checkSlug=${encodeURIComponent(slug)}`);
        const data = await response.json();
        setSlugStatus(data.available ? "valid" : "taken");
      } catch {
        setSlugStatus("idle");
      } finally {
        setIsValidatingSlug(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  async function validateCoupon() {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setCouponStatus("valid");
      } else {
        setCouponStatus("invalid");
        setCouponError(data.error?.message || "유효하지 않은 쿠폰입니다.");
      }
    } catch {
      setCouponStatus("invalid");
      setCouponError("쿠폰 검증에 실패했습니다.");
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  async function handlePublish() {
    if (!slug || slugStatus !== "valid" || couponStatus !== "valid") {
      toast.error("모든 항목을 확인해주세요.");
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch(`/api/invitations/${invitationId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode, slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishedUrl(data.data.url);
        toast.success("청첩장이 발행되었습니다!");
      } else {
        throw new Error(data.error?.message || "발행에 실패했습니다.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "발행에 실패했습니다.");
    } finally {
      setIsPublishing(false);
    }
  }

  const isAllValid = validation ? Object.values(validation).every(Boolean) : false;
  const canPublish = isAllValid && slugStatus === "valid" && couponStatus === "valid";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
        >
          {publishedUrl ? (
            <SuccessView url={publishedUrl} onClose={onClose} />
          ) : (
            <PublishForm
              slug={slug}
              setSlug={setSlug}
              slugStatus={slugStatus}
              isValidatingSlug={isValidatingSlug}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponStatus={couponStatus}
              couponError={couponError}
              isValidatingCoupon={isValidatingCoupon}
              validateCoupon={validateCoupon}
              validation={validation}
              isPublishing={isPublishing}
              canPublish={canPublish}
              onPublish={handlePublish}
              onClose={onClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface PublishFormProps {
  slug: string;
  setSlug: (slug: string) => void;
  slugStatus: "idle" | "valid" | "taken" | "invalid";
  isValidatingSlug: boolean;
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponStatus: "idle" | "valid" | "invalid";
  couponError: string;
  isValidatingCoupon: boolean;
  validateCoupon: () => void;
  validation: ValidationStatus | null;
  isPublishing: boolean;
  canPublish: boolean;
  onPublish: () => void;
  onClose: () => void;
}

function PublishForm({
  slug,
  setSlug,
  slugStatus,
  isValidatingSlug,
  couponCode,
  setCouponCode,
  couponStatus,
  couponError,
  isValidatingCoupon,
  validateCoupon,
  validation,
  isPublishing,
  canPublish,
  onPublish,
  onClose,
}: PublishFormProps) {
  return (
    <>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display text-brown-900">청첩장 발행하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">청첩장 주소</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">yeonjeong.kr/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9가-힣-]/g, ""))}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-coral-400"
              placeholder="your-wedding"
            />
          </div>
          <div className="mt-2 text-sm">
            {isValidatingSlug && <span className="text-gray-400">확인 중...</span>}
            {!isValidatingSlug && slugStatus === "valid" && (
              <span className="text-green-600">✓ 사용 가능한 주소입니다</span>
            )}
            {!isValidatingSlug && slugStatus === "taken" && (
              <span className="text-red-500">이미 사용 중인 주소입니다</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">영문 소문자, 숫자, 한글, 하이픈 사용 가능 (3~30자)</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">발행 전 체크리스트</p>
          <div className="space-y-2">
            <CheckItem label="예식일" checked={validation?.hasWeddingDate ?? false} />
            <CheckItem label="예식 시간" checked={validation?.hasWeddingTime ?? false} />
            <CheckItem label="예식장" checked={validation?.hasVenue ?? false} />
            <CheckItem label="신랑 이름" checked={validation?.hasGroomName ?? false} />
            <CheckItem label="신부 이름" checked={validation?.hasBrideName ?? false} />
            <CheckItem label="사진 1장 이상" checked={validation?.hasPhoto ?? false} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">쿠폰 코드</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                if (couponStatus !== "idle") {
                  setCouponCode(e.target.value.toUpperCase());
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-coral-400 uppercase"
              placeholder="YJ-XXXX-XXXX"
            />
            <button
              onClick={validateCoupon}
              disabled={isValidatingCoupon || !couponCode.trim()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {isValidatingCoupon ? "..." : "적용"}
            </button>
          </div>
          <div className="mt-2 text-sm">
            {couponStatus === "valid" && <span className="text-green-600">✓ 유효한 쿠폰입니다</span>}
            {couponStatus === "invalid" && <span className="text-red-500">{couponError}</span>}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            쿠폰이 없으신가요?{" "}
            <a
              href="https://smartstore.naver.com/yeonjeong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-500 hover:underline"
            >
              스마트스토어에서 구매하기 →
            </a>
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onPublish}
          disabled={!canPublish || isPublishing}
          className="w-full py-3 bg-coral-500 text-white font-medium rounded-xl hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPublishing ? "발행 중..." : "청첩장 발행하기"}
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          발행 후에도 내용 수정이 가능합니다
        </p>
      </div>
    </>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={checked ? "text-green-500" : "text-gray-300"}>
        {checked ? "✓" : "○"}
      </span>
      <span className={checked ? "text-gray-700" : "text-gray-400"}>{label}</span>
    </div>
  );
}

function SuccessView({ url, onClose }: { url: string; onClose: () => void }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <div className="p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl mb-6"
      >
        🎉
      </motion.div>
      <h2 className="text-2xl font-display text-brown-900 mb-2">청첩장이 발행되었어요!</h2>
      <p className="text-gray-500 mb-6">이제 링크를 공유해보세요</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-1">청첩장 주소</p>
        <p className="text-coral-600 font-medium break-all">{url}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          링크 복사
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-coral-500 text-white font-medium rounded-xl hover:bg-coral-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default PublishModal;
