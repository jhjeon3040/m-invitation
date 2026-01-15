"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PublishModal } from "@/components/editor/PublishModal";
import {
  ChevronLeft,
  FileText,
  Palette,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  Wallet,
  Save,
  Check,
  Loader2,
  Upload,
  Star,
  Trash2,
  Sparkles,
  Eye,
  Heart,
  MapPin,
  Navigation,
  Car,
  Train,
  Search,
  Lock,
  Video,
  ImagePlus,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

type Section = "basic" | "design" | "message" | "gallery" | "location" | "secret" | "settings" | "accounts";

interface InvitationData {
  id: string;
  groomName: string;
  brideName: string;
  groomFather: string | null;
  groomMother: string | null;
  groomOrder: string | null;
  groomPhone: string | null;
  brideFather: string | null;
  brideMother: string | null;
  brideOrder: string | null;
  bridePhone: string | null;
  weddingDate: string;
  weddingTime: string | null;
  venueName: string;
  venueAddress: string | null;
  venueFloor: string | null;
  venueLat: number | null;
  venueLng: number | null;
  theme: string;
  invitationMsg: string | null;
  settings: {
    rsvp?: { enabled: boolean };
    guestbook?: { enabled: boolean };
    transportation?: {
      subway: string;
      bus: string;
      car: string;
      parking: string;
    };
    share?: {
      title: string;
      description: string;
    };
    music?: {
      enabled: boolean;
      url: string;
      autoPlay: boolean;
    };
  };
  accounts: {
    groom: { bank: string; number: string; holder: string }[];
    bride: { bank: string; number: string; holder: string }[];
  } | null;
  secretEnabled: boolean;
  secretType: string | null;
  secretUrl: string | null;
  secretMessage: string | null;
  secretTrigger: string | null;
}

const sections: { id: Section; icon: React.FC<LucideProps>; label: string }[] = [
  { id: "basic", icon: FileText, label: "기본정보" },
  { id: "design", icon: Palette, label: "디자인" },
  { id: "message", icon: MessageSquare, label: "초대글" },
  { id: "gallery", icon: ImageIcon, label: "갤러리" },
  { id: "location", icon: MapPin, label: "오시는길" },
  { id: "secret", icon: Lock, label: "시크릿" },
  { id: "settings", icon: Settings, label: "설정" },
  { id: "accounts", icon: Wallet, label: "계좌" },
];

const themes = [
  { id: "romantic-pink", name: "로맨틱 핑크", color: "#FFE4E9", accent: "#FF8E76" },
  { id: "classic-ivory", name: "클래식 아이보리", color: "#FDF8F3", accent: "#D4A574" },
  { id: "modern-gray", name: "모던 그레이", color: "#F0F4F8", accent: "#6B7280" },
];

export default function EditorPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [activeSection, setActiveSection] = useState<Section>("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    groomFather: "",
    groomMother: "",
    groomOrder: "",
    groomPhone: "",
    brideFather: "",
    brideMother: "",
    brideOrder: "",
    bridePhone: "",
    weddingDate: "",
    weddingTime: "14:00",
    venueName: "",
    venueAddress: "",
    venueFloor: "",
    venueLat: null as number | null,
    venueLng: null as number | null,
    theme: "romantic-pink",
    message: "",
    rsvpEnabled: true,
    guestbookEnabled: true,
    accounts: {
      groom: [{ bank: "", number: "", holder: "" }],
      bride: [{ bank: "", number: "", holder: "" }],
    },
    transportation: {
      subway: "",
      bus: "",
      car: "",
      parking: "",
    },
    share: {
      title: "",
      description: "",
    },
    music: {
      enabled: false,
      url: "",
      autoPlay: false,
    },
    secretEnabled: false,
    secretType: "image" as "image" | "video",
    secretUrl: "",
    secretMessage: "",
    secretTrigger: "",
  });

  const initialDataRef = useRef<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    async function loadInvitation() {
      try {
        const response = await fetch(`/api/invitations/${invitationId}`);
        if (!response.ok) throw new Error("Failed to load invitation");

        const { invitation } = (await response.json()) as { invitation: InvitationData };

        const loadedData = {
          groomName: invitation.groomName,
          brideName: invitation.brideName,
          groomFather: invitation.groomFather || "",
          groomMother: invitation.groomMother || "",
          groomOrder: invitation.groomOrder || "",
          groomPhone: invitation.groomPhone || "",
          brideFather: invitation.brideFather || "",
          brideMother: invitation.brideMother || "",
          brideOrder: invitation.brideOrder || "",
          bridePhone: invitation.bridePhone || "",
          weddingDate: invitation.weddingDate?.split("T")[0] || "",
          weddingTime: invitation.weddingTime || "14:00",
          venueName: invitation.venueName,
          venueAddress: invitation.venueAddress || "",
          venueFloor: invitation.venueFloor || "",
          venueLat: invitation.venueLat || null,
          venueLng: invitation.venueLng || null,
          theme: invitation.theme,
          message: invitation.invitationMsg || "",
          rsvpEnabled: invitation.settings?.rsvp?.enabled ?? true,
          guestbookEnabled: invitation.settings?.guestbook?.enabled ?? true,
          accounts: invitation.accounts || {
            groom: [{ bank: "", number: "", holder: "" }],
            bride: [{ bank: "", number: "", holder: "" }],
          },
          transportation: invitation.settings?.transportation || {
            subway: "",
            bus: "",
            car: "",
            parking: "",
          },
          share: invitation.settings?.share || {
            title: "",
            description: "",
          },
          music: invitation.settings?.music || {
            enabled: false,
            url: "",
            autoPlay: false,
          },
          secretEnabled: invitation.secretEnabled || false,
          secretType: (invitation.secretType as "image" | "video") || "image",
          secretUrl: invitation.secretUrl || "",
          secretMessage: invitation.secretMessage || "",
          secretTrigger: invitation.secretTrigger || "",
        };

        setFormData(loadedData);
        initialDataRef.current = JSON.stringify(loadedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInvitation();
  }, [invitationId]);

  // Auto-save: detect changes and save after 2 seconds of inactivity
  useEffect(() => {
    if (isLoading || !initialDataRef.current) return;

    const currentData = JSON.stringify(formData);
    const hasChanges = currentData !== initialDataRef.current;
    setHasUnsavedChanges(hasChanges);

    if (!hasChanges) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new auto-save timeout (2 seconds)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, isLoading]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomName: formData.groomName,
          brideName: formData.brideName,
          groomFather: formData.groomFather || null,
          groomMother: formData.groomMother || null,
          groomOrder: formData.groomOrder || null,
          groomPhone: formData.groomPhone || null,
          brideFather: formData.brideFather || null,
          brideMother: formData.brideMother || null,
          brideOrder: formData.brideOrder || null,
          bridePhone: formData.bridePhone || null,
          weddingDate: formData.weddingDate,
          weddingTime: formData.weddingTime,
          venueName: formData.venueName,
          venueAddress: formData.venueAddress || null,
          venueFloor: formData.venueFloor || null,
          venueLat: formData.venueLat,
          venueLng: formData.venueLng,
          theme: formData.theme,
          invitationMsg: formData.message,
          settings: {
            rsvp: { enabled: formData.rsvpEnabled },
            guestbook: { enabled: formData.guestbookEnabled },
            transportation: formData.transportation,
            share: formData.share,
            music: formData.music,
          },
          accounts: formData.accounts,
          secretEnabled: formData.secretEnabled,
          secretType: formData.secretType,
          secretUrl: formData.secretUrl || null,
          secretMessage: formData.secretMessage || null,
          secretTrigger: formData.secretTrigger || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      // Update initial data ref to mark current state as saved
      initialDataRef.current = JSON.stringify(formData);
      setHasUnsavedChanges(false);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [invitationId, formData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mesh bg-noise flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-12 h-12 border-3 border-[var(--color-coral-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-brown-700)]">청첩장을 불러오는 중...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-cream-dark)]">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Back */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[var(--color-brown-700)] hover:text-[var(--color-coral-500)] transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">내 청첩장</span>
          </Link>

          {/* Center: Names */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-brown-900)] font-semibold">{formData.brideName}</span>
            <Heart className="w-4 h-4 text-[var(--color-coral-500)] fill-[var(--color-coral-500)]" />
            <span className="text-[var(--color-brown-900)] font-semibold">{formData.groomName}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Auto-save status indicator */}
            {hasUnsavedChanges && !isSaving && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-[var(--color-brown-500)]"
              >
                자동 저장 중...
              </motion.span>
            )}

            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                saveStatus === "saved"
                  ? "bg-[var(--color-sage-light)] text-[var(--color-sage-green)]"
                  : hasUnsavedChanges
                  ? "bg-[var(--color-coral-500)]/10 text-[var(--color-coral-500)] border border-[var(--color-coral-400)]"
                  : "bg-[var(--color-cream-bg)] text-[var(--color-brown-700)] hover:bg-[var(--color-cream-dark)]"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>저장 중</span>
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>저장됨</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <div className="w-2 h-2 bg-[var(--color-coral-500)] rounded-full animate-pulse" />
                  <span>저장 대기</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsPublishModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--color-coral-500)] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[var(--color-coral-500)]/25 hover:shadow-[var(--color-coral-500)]/40 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>발행하기</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ============ DESKTOP LAYOUT ============ */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-[var(--color-cream-dark)] p-5">
          <nav className="space-y-1.5">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)] text-white shadow-lg shadow-[var(--color-coral-500)]/25"
                      : "text-[var(--color-brown-700)] hover:bg-[var(--color-cream-bg)]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[var(--color-coral-500)]"}`} />
                  <span className="font-medium">{section.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Progress indicator */}
          <div className="mt-8 p-4 bg-[var(--color-cream-bg)] rounded-2xl">
            <p className="text-sm text-[var(--color-brown-700)] mb-3">작성 진행률</p>
            <div className="h-2 bg-[var(--color-cream-dark)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-rose-soft)] rounded-full"
              />
            </div>
            <p className="text-xs text-[var(--color-brown-500)] mt-2">6개 중 4개 완료</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 mr-[380px]">
          <div className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeSection === "basic" && <BasicInfoSection formData={formData} setFormData={setFormData} />}
                {activeSection === "design" && (
                  <DesignSection formData={formData} setFormData={setFormData} themes={themes} />
                )}
                {activeSection === "message" && <MessageSection formData={formData} setFormData={setFormData} />}
                {activeSection === "gallery" && <GallerySection invitationId={invitationId} />}
                {activeSection === "location" && <LocationSection formData={formData} setFormData={setFormData} />}
                {activeSection === "secret" && <SecretSection formData={formData} setFormData={setFormData} />}
                {activeSection === "settings" && <SettingsSection formData={formData} setFormData={setFormData} />}
                {activeSection === "accounts" && <AccountsSection formData={formData} setFormData={setFormData} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Phone Preview Panel */}
        <aside className="w-[380px] fixed right-0 top-16 bottom-0 bg-gradient-to-br from-[var(--color-cream-bg)] to-[var(--color-rose-light)] border-l border-[var(--color-cream-dark)] flex items-center justify-center p-6">
          <div className="relative">
            {/* Decorative glow */}
            <div className="absolute -inset-8 bg-[var(--color-coral-500)]/10 blur-3xl rounded-full" />
            <PhonePreview formData={formData} />
          </div>
        </aside>
      </div>

      {/* ============ MOBILE LAYOUT ============ */}
      <div className="md:hidden">
        {/* Mobile Tab Navigation */}
        <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-lg border-b border-[var(--color-cream-dark)]">
          <div className="flex overflow-x-auto px-3 py-3 gap-2 scrollbar-hide">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-coral-500)] text-white shadow-md shadow-[var(--color-coral-500)]/25"
                      : "bg-[var(--color-cream-bg)] text-[var(--color-brown-700)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <main className="p-5 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeSection === "basic" && <BasicInfoSection formData={formData} setFormData={setFormData} />}
              {activeSection === "design" && (
                <DesignSection formData={formData} setFormData={setFormData} themes={themes} />
              )}
              {activeSection === "message" && <MessageSection formData={formData} setFormData={setFormData} />}
              {activeSection === "gallery" && <GallerySection invitationId={invitationId} />}
              {activeSection === "location" && <LocationSection formData={formData} setFormData={setFormData} />}
              {activeSection === "secret" && <SecretSection formData={formData} setFormData={setFormData} />}
              {activeSection === "settings" && <SettingsSection formData={formData} setFormData={setFormData} />}
              {activeSection === "accounts" && <AccountsSection formData={formData} setFormData={setFormData} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        invitationId={invitationId}
        groomName={formData.groomName}
        brideName={formData.brideName}
      />
    </div>
  );
}

/* ============ SECTION HEADER COMPONENT ============ */
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--color-brown-900)] mb-2">{title}</h2>
      {description && <p className="text-[var(--color-brown-500)]">{description}</p>}
    </div>
  );
}

/* ============ INPUT FIELD COMPONENT ============ */
function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
}) {
  const hasError = error && error.length > 0;

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">
        {label}
        {required && <span className="text-[var(--color-coral-500)] ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:ring-4 transition-all ${
          hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-[var(--color-cream-dark)] focus:border-[var(--color-coral-400)] focus:ring-[var(--color-coral-500)]/10"
        }`}
      />
      {hasError && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ============ VALIDATION HELPERS ============ */
function validatePhone(phone: string): string | undefined {
  if (!phone) return undefined;
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length < 10 || cleaned.length > 11) {
    return "올바른 전화번호를 입력해주세요";
  }
  return undefined;
}

function validateUrl(url: string): string | undefined {
  if (!url) return undefined;
  try {
    new URL(url);
    return undefined;
  } catch {
    return "올바른 URL을 입력해주세요";
  }
}

function validateDate(date: string): string | undefined {
  if (!date) return "날짜를 선택해주세요";
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return "오늘 이후 날짜를 선택해주세요";
  }
  return undefined;
}

/* ============ BASIC INFO SECTION ============ */
function BasicInfoSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const getError = (field: string, validator?: (v: string) => string | undefined) => {
    if (!touched[field]) return undefined;
    const value = formData[field] || "";
    if (validator) return validator(value);
    if (!value.trim()) return "필수 입력 항목입니다";
    return undefined;
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="기본정보" description="청첩장에 표시될 기본 정보를 입력해주세요" />

      {/* 신랑 정보 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-coral-500)]/10 flex items-center justify-center">
            <span className="text-sm">🤵</span>
          </div>
          <h3 className="font-semibold text-[var(--color-brown-900)]">신랑 정보</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="신랑 이름"
              value={formData.groomName}
              onChange={(v) => {
                markTouched("groomName");
                setFormData({ ...formData, groomName: v });
              }}
              placeholder="홍길동"
              required
              error={getError("groomName")}
            />
            <InputField
              label="서열 (선택)"
              value={formData.groomOrder}
              onChange={(v) => setFormData({ ...formData, groomOrder: v })}
              placeholder="장남"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="아버지 성함"
              value={formData.groomFather}
              onChange={(v) => setFormData({ ...formData, groomFather: v })}
              placeholder="홍판서"
            />
            <InputField
              label="어머니 성함"
              value={formData.groomMother}
              onChange={(v) => setFormData({ ...formData, groomMother: v })}
              placeholder="김부인"
            />
          </div>
          <InputField
            label="연락처"
            type="tel"
            value={formData.groomPhone}
            onChange={(v) => {
              markTouched("groomPhone");
              setFormData({ ...formData, groomPhone: v });
            }}
            placeholder="010-1234-5678"
            error={getError("groomPhone", validatePhone)}
          />
        </div>
      </div>

      {/* 신부 정보 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-rose-light)] flex items-center justify-center">
            <span className="text-sm">👰</span>
          </div>
          <h3 className="font-semibold text-[var(--color-brown-900)]">신부 정보</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="신부 이름"
              value={formData.brideName}
              onChange={(v) => {
                markTouched("brideName");
                setFormData({ ...formData, brideName: v });
              }}
              placeholder="김영희"
              required
              error={getError("brideName")}
            />
            <InputField
              label="서열 (선택)"
              value={formData.brideOrder}
              onChange={(v) => setFormData({ ...formData, brideOrder: v })}
              placeholder="장녀"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="아버지 성함"
              value={formData.brideFather}
              onChange={(v) => setFormData({ ...formData, brideFather: v })}
              placeholder="김대감"
            />
            <InputField
              label="어머니 성함"
              value={formData.brideMother}
              onChange={(v) => setFormData({ ...formData, brideMother: v })}
              placeholder="이부인"
            />
          </div>
          <InputField
            label="연락처"
            type="tel"
            value={formData.bridePhone}
            onChange={(v) => {
              markTouched("bridePhone");
              setFormData({ ...formData, bridePhone: v });
            }}
            placeholder="010-9876-5432"
            error={getError("bridePhone", validatePhone)}
          />
        </div>
      </div>

      {/* 예식 일정 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">예식 일정</h3>
        <div className="grid grid-cols-2 gap-5">
          <InputField
            label="예식일"
            type="date"
            value={formData.weddingDate}
            onChange={(v) => {
              markTouched("weddingDate");
              setFormData({ ...formData, weddingDate: v });
            }}
            required
            error={getError("weddingDate", validateDate)}
          />
          <InputField
            label="예식 시간"
            type="time"
            value={formData.weddingTime}
            onChange={(v) => setFormData({ ...formData, weddingTime: v })}
          />
        </div>
      </div>

      {/* 예식장 정보 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">
          예식장 정보
        </h3>
        <div className="space-y-4">
          <InputField
            label="예식장 이름"
            value={formData.venueName}
            onChange={(v) => {
              markTouched("venueName");
              setFormData({ ...formData, venueName: v });
            }}
            placeholder="더 채플앳청담"
            required
            error={getError("venueName")}
          />
          <InputField
            label="주소"
            value={formData.venueAddress}
            onChange={(v) => setFormData({ ...formData, venueAddress: v })}
            placeholder="서울특별시 강남구 청담동 123-45"
          />
          <InputField
            label="층/홀 (선택)"
            value={formData.venueFloor}
            onChange={(v) => setFormData({ ...formData, venueFloor: v })}
            placeholder="3층 그랜드홀"
          />
        </div>
      </div>
    </div>
  );
}

/* ============ DESIGN SECTION ============ */
function DesignSection({ formData, setFormData, themes }: { formData: any; setFormData: any; themes: any[] }) {
  return (
    <div className="space-y-8">
      <SectionHeader title="디자인" description="청첩장의 분위기를 선택해주세요" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {themes.map((theme) => {
          const isSelected = formData.theme === theme.id;

          return (
            <motion.button
              key={theme.id}
              onClick={() => setFormData({ ...formData, theme: theme.id })}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-[var(--color-coral-500)] shadow-xl shadow-[var(--color-coral-500)]/15 bg-white"
                  : "border-[var(--color-cream-dark)] hover:border-[var(--color-coral-400)] bg-white/80"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-coral-500)] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}

              <div
                className="w-full aspect-[3/4] rounded-xl mb-4 border border-[var(--color-cream-dark)]"
                style={{ backgroundColor: theme.color }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                </div>
              </div>

              <p className="font-semibold text-[var(--color-brown-900)]">{theme.name}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ MESSAGE SECTION ============ */
const AI_TONES = [
  { id: "정중한", label: "정중한", description: "격식 있고 전통적인 느낌" },
  { id: "따뜻한", label: "따뜻한", description: "감성적이고 품격 있는 느낌" },
  { id: "캐주얼", label: "캐주얼", description: "친근하고 편안한 느낌" },
  { id: "시적인", label: "시적인", description: "문학적이고 아름다운 표현" },
];

function MessageSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateMessage(tone: string) {
    setShowToneMenu(false);
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomName: formData.groomName,
          brideName: formData.brideName,
          weddingDate: formData.weddingDate,
          venueName: formData.venueName,
          tone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "생성에 실패했습니다");
      }

      const { message } = await response.json();
      setFormData({ ...formData, message });
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="초대글" description="마음을 담은 초대 메시지를 작성해주세요" />
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowToneMenu(!showToneMenu)}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-rose-soft)] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[var(--color-coral-500)]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI로 작성하기
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {showToneMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[var(--color-cream-dark)] shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-[var(--color-brown-500)]">
                    어떤 느낌으로 작성할까요?
                  </p>
                  {AI_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => generateMessage(tone.id)}
                      className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-[var(--color-cream-bg)] transition-colors"
                    >
                      <p className="text-sm font-medium text-[var(--color-brown-900)]">
                        {tone.label}
                      </p>
                      <p className="text-xs text-[var(--color-brown-500)]">
                        {tone.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={10}
          disabled={isGenerating}
          className="w-full px-4 py-4 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none leading-relaxed disabled:opacity-60"
          placeholder="소중한 분들을 초대합니다..."
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[var(--color-brown-500)]">{formData.message.length}자</p>
          <p className="text-xs text-[var(--color-gray-400)]">권장 100~300자</p>
        </div>
      </div>

      {!formData.groomName || !formData.brideName ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[var(--color-brown-500)] text-center"
        >
          💡 AI 생성을 위해 먼저 기본 정보에서 신랑/신부 이름을 입력해주세요
        </motion.p>
      ) : null}
    </div>
  );
}

/* ============ GALLERY SECTION ============ */
interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  isCover: boolean;
  order: number;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

function GallerySection({ invitationId }: { invitationId: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 30;

  useEffect(() => {
    loadGalleryImages();
  }, [invitationId]);

  async function loadGalleryImages() {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`);
      if (response.ok) {
        const { invitation } = await response.json();
        if (invitation.gallery) {
          setImages(invitation.gallery);
        }
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    const availableSlots = MAX_IMAGES - images.length - uploading.length;
    const filesToUpload = fileArray.slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    const newUploading: UploadingFile[] = filesToUpload.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "pending",
    }));

    setUploading((prev) => [...prev, ...newUploading]);

    for (const uploadItem of newUploading) {
      await uploadSingleFile(uploadItem);
    }
  }

  async function uploadSingleFile(uploadItem: UploadingFile) {
    setUploading((prev) => prev.map((u) => (u.id === uploadItem.id ? { ...u, status: "uploading" } : u)));

    try {
      const { uploadGalleryImage } = await import("@/lib/upload/utils");

      await uploadGalleryImage(invitationId, uploadItem.file, (progress) => {
        setUploading((prev) => prev.map((u) => (u.id === uploadItem.id ? { ...u, progress: progress.percent } : u)));
      });

      setUploading((prev) => prev.map((u) => (u.id === uploadItem.id ? { ...u, status: "completed", progress: 100 } : u)));

      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => u.id !== uploadItem.id));
        loadGalleryImages();
      }, 500);
    } catch (error) {
      setUploading((prev) =>
        prev.map((u) =>
          u.id === uploadItem.id
            ? { ...u, status: "error", error: error instanceof Error ? error.message : "업로드 실패" }
            : u
        )
      );
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  async function handleSetCover(imageId: string) {
    try {
      await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImageId: imageId }),
      });
      setImages((prev) => prev.map((img) => ({ ...img, isCover: img.id === imageId })));
    } catch (error) {
      console.error("Failed to set cover:", error);
    }
  }

  async function handleDelete(imageId: string) {
    try {
      await fetch(`/api/gallery/${imageId}`, { method: "DELETE" });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  const totalCount = images.length + uploading.filter((u) => u.status !== "error").length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SectionHeader title="갤러리" />
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[var(--color-coral-500)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="갤러리" description="최대 30장까지 업로드할 수 있어요" />
        <span className="text-sm font-semibold text-[var(--color-coral-500)]">
          {totalCount}/{MAX_IMAGES}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all overflow-hidden ${
          isDragOver
            ? "border-[var(--color-coral-500)] bg-[var(--color-coral-500)]/5"
            : "border-[var(--color-cream-dark)] hover:border-[var(--color-coral-400)] bg-white"
        } ${totalCount >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-coral-500)] to-[var(--color-rose-soft)] flex items-center justify-center shadow-lg shadow-[var(--color-coral-500)]/20">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <p className="text-[var(--color-brown-900)] font-semibold mb-1">
            {totalCount >= MAX_IMAGES ? "최대 장수에 도달했습니다" : "사진을 추가해주세요"}
          </p>
          <p className="text-sm text-[var(--color-brown-500)]">드래그하거나 클릭해서 업로드</p>
          <p className="text-xs text-[var(--color-gray-400)] mt-3">JPG, PNG, WebP, HEIC · 장당 최대 20MB</p>
        </div>
      </motion.div>

      {/* Uploading items */}
      {uploading.length > 0 && (
        <div className="space-y-3">
          {uploading.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-cream-dark)]"
            >
              <div className="w-14 h-14 bg-[var(--color-cream-bg)] rounded-lg flex items-center justify-center overflow-hidden">
                <img src={URL.createObjectURL(item.file)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-brown-900)] truncate">{item.file.name}</p>
                {item.status === "uploading" && (
                  <div className="mt-2 h-1.5 bg-[var(--color-cream-dark)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className="h-full bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-rose-soft)] rounded-full"
                    />
                  </div>
                )}
                {item.status === "error" && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
              </div>
              <div className="flex-shrink-0">
                {item.status === "uploading" && (
                  <span className="text-sm font-medium text-[var(--color-coral-500)]">{item.progress}%</span>
                )}
                {item.status === "completed" && <Check className="w-5 h-5 text-[var(--color-sage-green)]" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-cream-bg)] group"
            >
              <img src={image.thumbnailUrl || image.url} alt="" className="w-full h-full object-cover" />
              {image.isCover && (
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-[var(--color-coral-500)] text-white text-xs font-semibold rounded-full shadow-lg">
                  대표
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {!image.isCover && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSetCover(image.id)}
                    className="p-2.5 bg-white rounded-full text-[var(--color-coral-500)] shadow-lg"
                    title="대표 사진으로 설정"
                  >
                    <Star className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(image.id)}
                  className="p-2.5 bg-white rounded-full text-red-500 shadow-lg"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-center text-[var(--color-brown-500)]">
          첫 번째 사진이 카카오톡 공유 시 대표 이미지로 사용됩니다
        </p>
      )}
    </div>
  );
}

/* ============ SETTINGS SECTION ============ */
function SettingsSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-8">
      <SectionHeader title="설정" description="청첩장의 기능을 설정해주세요" />

      {/* 기능 설정 */}
      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm"
        >
          <div>
            <p className="font-semibold text-[var(--color-brown-900)]">참석 여부 (RSVP)</p>
            <p className="text-sm text-[var(--color-brown-500)] mt-1">하객들의 참석 여부를 받습니다</p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, rsvpEnabled: !formData.rsvpEnabled })}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              formData.rsvpEnabled
                ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)]"
                : "bg-[var(--color-cream-dark)]"
            }`}
          >
            <motion.div
              animate={{ x: formData.rsvpEnabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm"
        >
          <div>
            <p className="font-semibold text-[var(--color-brown-900)]">방명록</p>
            <p className="text-sm text-[var(--color-brown-500)] mt-1">축하 메시지를 받습니다</p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, guestbookEnabled: !formData.guestbookEnabled })}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              formData.guestbookEnabled
                ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)]"
                : "bg-[var(--color-cream-dark)]"
            }`}
          >
            <motion.div
              animate={{ x: formData.guestbookEnabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </motion.div>
      </div>

      {/* 카카오톡 공유 설정 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.32 4.67 6.73l-.95 3.53c-.08.31.27.56.54.38l4.19-2.74c.51.06 1.03.1 1.55.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[var(--color-brown-900)]">카카오톡 공유 설정</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">공유 제목</label>
            <input
              type="text"
              value={formData.share.title}
              onChange={(e) => setFormData({
                ...formData,
                share: { ...formData.share, title: e.target.value }
              })}
              placeholder={`${formData.groomName || "신랑"} ♥ ${formData.brideName || "신부"} 결혼합니다`}
              className="w-full px-4 py-3.5 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">공유 설명</label>
            <textarea
              value={formData.share.description}
              onChange={(e) => setFormData({
                ...formData,
                share: { ...formData.share, description: e.target.value }
              })}
              rows={2}
              placeholder="소중한 분들을 초대합니다"
              className="w-full px-4 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
            />
          </div>
          <p className="text-xs text-[var(--color-brown-500)]">
            💡 비워두면 기본값이 사용됩니다. 대표 이미지는 갤러리 첫 번째 사진이 사용됩니다.
          </p>
        </div>
      </div>

      {/* BGM 설정 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-coral-500)]/10 flex items-center justify-center">
              <span className="text-sm">🎵</span>
            </div>
            <h3 className="font-semibold text-[var(--color-brown-900)]">배경음악 (BGM)</h3>
          </div>
          <button
            onClick={() => setFormData({
              ...formData,
              music: { ...formData.music, enabled: !formData.music.enabled }
            })}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              formData.music.enabled
                ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)]"
                : "bg-[var(--color-cream-dark)]"
            }`}
          >
            <motion.div
              animate={{ x: formData.music.enabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>

        {formData.music.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">음악 URL</label>
              <input
                type="url"
                value={formData.music.url}
                onChange={(e) => setFormData({
                  ...formData,
                  music: { ...formData.music, url: e.target.value }
                })}
                placeholder="https://example.com/music.mp3"
                className="w-full px-4 py-3.5 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all"
              />
              <p className="text-xs text-[var(--color-brown-500)] mt-2">
                MP3, WAV 파일 URL을 입력하세요. 저작권에 유의해주세요.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-[var(--color-cream-bg)]/50 rounded-xl"
            >
              <div>
                <p className="font-medium text-[var(--color-brown-900)]">자동재생</p>
                <p className="text-xs text-[var(--color-brown-500)] mt-0.5">페이지 열면 자동 재생 (일부 브라우저에서 제한)</p>
              </div>
              <button
                onClick={() => setFormData({
                  ...formData,
                  music: { ...formData.music, autoPlay: !formData.music.autoPlay }
                })}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                  formData.music.autoPlay
                    ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)]"
                    : "bg-[var(--color-cream-dark)]"
                }`}
              >
                <motion.div
                  animate={{ x: formData.music.autoPlay ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ============ LOCATION SECTION ============ */
function LocationSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [isSearching, setIsSearching] = useState(false);

  const searchAddress = async () => {
    if (!formData.venueAddress) return;

    setIsSearching(true);
    try {
      // 카카오 주소 검색 API 호출
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(formData.venueAddress)}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          const { x, y } = data.documents[0];
          setFormData({
            ...formData,
            venueLat: parseFloat(y),
            venueLng: parseFloat(x),
          });
        }
      }
    } catch (error) {
      console.error("주소 검색 실패:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="오시는 길" description="예식장 위치와 교통안내 정보를 입력해주세요" />

      {/* 주소 검색 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">
          예식장 위치
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">주소</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                placeholder="서울특별시 강남구 청담동 123-45"
                className="flex-1 px-4 py-3.5 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all"
              />
              <motion.button
                onClick={searchAddress}
                disabled={isSearching || !formData.venueAddress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3.5 bg-[var(--color-coral-500)] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">검색</span>
              </motion.button>
            </div>
          </div>

          {/* 지도 미리보기 */}
          {formData.venueLat && formData.venueLng ? (
            <div className="relative">
              <div className="aspect-video bg-[var(--color-cream-bg)] rounded-xl overflow-hidden border border-[var(--color-cream-dark)]">
                <iframe
                  src={`https://map.kakao.com/link/map/${formData.venueName || "예식장"},${formData.venueLat},${formData.venueLng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-[var(--color-brown-700)] shadow-sm">
                <MapPin className="w-3 h-3 inline mr-1" />
                좌표: {formData.venueLat.toFixed(6)}, {formData.venueLng.toFixed(6)}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-[var(--color-cream-bg)] rounded-xl flex flex-col items-center justify-center border border-[var(--color-cream-dark)]">
              <MapPin className="w-10 h-10 text-[var(--color-brown-400)] mb-3" />
              <p className="text-sm text-[var(--color-brown-500)]">주소를 검색하면 지도가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 교통안내 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">
          교통안내
        </h3>
        <div className="space-y-5">
          {/* 지하철 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Train className="w-4 h-4 text-[var(--color-coral-500)]" />
              <label className="text-sm font-semibold text-[var(--color-brown-700)]">지하철</label>
            </div>
            <textarea
              value={formData.transportation.subway}
              onChange={(e) => setFormData({
                ...formData,
                transportation: { ...formData.transportation, subway: e.target.value }
              })}
              rows={2}
              placeholder="2호선 삼성역 5번 출구에서 도보 5분"
              className="w-full px-4 py-3 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
            />
          </div>

          {/* 버스 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Navigation className="w-4 h-4 text-[var(--color-coral-500)]" />
              <label className="text-sm font-semibold text-[var(--color-brown-700)]">버스</label>
            </div>
            <textarea
              value={formData.transportation.bus}
              onChange={(e) => setFormData({
                ...formData,
                transportation: { ...formData.transportation, bus: e.target.value }
              })}
              rows={2}
              placeholder="간선: 401, 402 / 지선: 4412 (○○정류장 하차)"
              className="w-full px-4 py-3 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
            />
          </div>

          {/* 자가용 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Car className="w-4 h-4 text-[var(--color-coral-500)]" />
              <label className="text-sm font-semibold text-[var(--color-brown-700)]">자가용</label>
            </div>
            <textarea
              value={formData.transportation.car}
              onChange={(e) => setFormData({
                ...formData,
                transportation: { ...formData.transportation, car: e.target.value }
              })}
              rows={2}
              placeholder="네비게이션: '더채플앳청담' 또는 '서울시 강남구 청담동 123-45' 검색"
              className="w-full px-4 py-3 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
            />
          </div>

          {/* 주차 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <MapPin className="w-4 h-4 text-[var(--color-coral-500)]" />
              <label className="text-sm font-semibold text-[var(--color-brown-700)]">주차안내</label>
            </div>
            <textarea
              value={formData.transportation.parking}
              onChange={(e) => setFormData({
                ...formData,
                transportation: { ...formData.transportation, parking: e.target.value }
              })}
              rows={2}
              placeholder="건물 내 지하주차장 2시간 무료 (이후 시간당 3,000원)"
              className="w-full px-4 py-3 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ SECRET SECTION ============ */
function SecretSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleUrlChange = (value: string) => {
    setFormData({ ...formData, secretUrl: value });
    if (value) {
      const error = validateUrl(value);
      setUrlError(error || null);
    } else {
      setUrlError(null);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="시크릿 콘텐츠"
        description="특별한 사진을 누르면 숨겨진 메시지가 나타나요"
      />

      {/* 활성화 토글 */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-coral-500)] to-[var(--color-rose-soft)] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-brown-900)]">시크릿 콘텐츠 사용</p>
              <p className="text-sm text-[var(--color-brown-500)]">갤러리 사진을 누르면 숨겨진 콘텐츠가 나타납니다</p>
            </div>
          </div>
          <button
            onClick={() => setFormData({ ...formData, secretEnabled: !formData.secretEnabled })}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              formData.secretEnabled
                ? "bg-gradient-to-r from-[var(--color-coral-500)] to-[var(--color-coral-400)]"
                : "bg-[var(--color-cream-dark)]"
            }`}
          >
            <motion.div
              animate={{ x: formData.secretEnabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </div>

      {formData.secretEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 콘텐츠 타입 선택 */}
          <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">
              콘텐츠 타입
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, secretType: "image" })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.secretType === "image"
                    ? "border-[var(--color-coral-500)] bg-[var(--color-coral-500)]/5"
                    : "border-[var(--color-cream-dark)] hover:border-[var(--color-coral-400)]"
                }`}
              >
                <ImagePlus className={`w-8 h-8 mx-auto mb-2 ${
                  formData.secretType === "image" ? "text-[var(--color-coral-500)]" : "text-[var(--color-brown-500)]"
                }`} />
                <p className={`font-medium ${
                  formData.secretType === "image" ? "text-[var(--color-coral-500)]" : "text-[var(--color-brown-700)]"
                }`}>이미지</p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, secretType: "video" })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.secretType === "video"
                    ? "border-[var(--color-coral-500)] bg-[var(--color-coral-500)]/5"
                    : "border-[var(--color-cream-dark)] hover:border-[var(--color-coral-400)]"
                }`}
              >
                <Video className={`w-8 h-8 mx-auto mb-2 ${
                  formData.secretType === "video" ? "text-[var(--color-coral-500)]" : "text-[var(--color-brown-500)]"
                }`} />
                <p className={`font-medium ${
                  formData.secretType === "video" ? "text-[var(--color-coral-500)]" : "text-[var(--color-brown-700)]"
                }`}>영상</p>
                <p className="text-xs text-[var(--color-brown-500)] mt-1">최대 30초</p>
              </button>
            </div>
          </div>

          {/* 콘텐츠 URL */}
          <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-coral-500)] uppercase tracking-wider mb-5">
              숨겨진 콘텐츠
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">
                  {formData.secretType === "video" ? "영상 URL" : "이미지 URL"}
                </label>
                <input
                  type="url"
                  value={formData.secretUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={formData.secretType === "video" ? "https://youtube.com/..." : "https://..."}
                  className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:ring-4 transition-all ${
                    urlError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : "border-[var(--color-cream-dark)] focus:border-[var(--color-coral-400)] focus:ring-[var(--color-coral-500)]/10"
                  }`}
                />
                {urlError && (
                  <p className="mt-1.5 text-xs text-red-500">{urlError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-brown-700)] mb-2.5">
                  함께 표시될 메시지
                </label>
                <textarea
                  value={formData.secretMessage}
                  onChange={(e) => setFormData({ ...formData, secretMessage: e.target.value })}
                  rows={3}
                  placeholder="우리만 아는 특별한 이야기..."
                  className="w-full px-4 py-3 bg-[var(--color-cream-bg)]/50 border-2 border-[var(--color-cream-dark)] rounded-xl text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)] focus:ring-4 focus:ring-[var(--color-coral-500)]/10 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 트리거 안내 */}
          <div className="p-5 bg-[var(--color-cream-bg)] rounded-2xl border border-[var(--color-cream-dark)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-coral-500)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-[var(--color-coral-500)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--color-brown-900)] mb-1">어떻게 작동하나요?</p>
                <p className="text-sm text-[var(--color-brown-600)] leading-relaxed">
                  갤러리의 <strong>대표 사진</strong>을 5초 이상 꾹 누르면 시크릿 콘텐츠가 나타납니다.
                  방문자에게 특별한 깜짝 선물을 준비해보세요!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ============ ACCOUNTS SECTION ============ */
function AccountsSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  const banks = ["", "국민은행", "신한은행", "우리은행", "하나은행", "농협", "카카오뱅크", "토스뱅크", "기업은행", "SC제일은행", "씨티은행", "케이뱅크"];

  const updateAccount = (side: "groom" | "bride", index: number, field: string, value: string) => {
    const newAccounts = { ...formData.accounts };
    newAccounts[side] = [...newAccounts[side]];
    newAccounts[side][index] = { ...newAccounts[side][index], [field]: value };
    setFormData({ ...formData, accounts: newAccounts });
  };

  const addAccount = (side: "groom" | "bride") => {
    const newAccounts = { ...formData.accounts };
    newAccounts[side] = [...newAccounts[side], { bank: "", number: "", holder: "" }];
    setFormData({ ...formData, accounts: newAccounts });
  };

  const removeAccount = (side: "groom" | "bride", index: number) => {
    if (formData.accounts[side].length <= 1) return;
    const newAccounts = { ...formData.accounts };
    newAccounts[side] = newAccounts[side].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, accounts: newAccounts });
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="계좌정보" description="축의금을 받을 계좌를 등록해주세요" />

      <div className="space-y-6">
        {/* Groom's accounts */}
        <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-coral-500)]/10 flex items-center justify-center">
                <span className="text-sm">🤵</span>
              </div>
              <h3 className="font-semibold text-[var(--color-brown-900)]">신랑 측</h3>
            </div>
            <button
              onClick={() => addAccount("groom")}
              className="text-sm text-[var(--color-coral-500)] font-medium hover:underline"
            >
              + 계좌 추가
            </button>
          </div>
          <div className="space-y-4">
            {formData.accounts.groom.map((account: any, index: number) => (
              <div key={index} className="space-y-3 p-4 bg-[var(--color-cream-bg)]/50 rounded-xl">
                {formData.accounts.groom.length > 1 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[var(--color-brown-500)]">계좌 {index + 1}</span>
                    <button
                      onClick={() => removeAccount("groom", index)}
                      className="text-xs text-red-400 hover:text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <select
                    value={account.bank}
                    onChange={(e) => updateAccount("groom", index, "bank", e.target.value)}
                    className="w-32 px-3 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] focus:outline-none focus:border-[var(--color-coral-400)]"
                  >
                    <option value="">은행 선택</option>
                    {banks.filter(b => b).map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={account.number}
                    onChange={(e) => updateAccount("groom", index, "number", e.target.value)}
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)]"
                  />
                </div>
                <input
                  type="text"
                  value={account.holder}
                  onChange={(e) => updateAccount("groom", index, "holder", e.target.value)}
                  placeholder="예금주"
                  className="w-full px-4 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bride's accounts */}
        <div className="p-6 bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-rose-light)] flex items-center justify-center">
                <span className="text-sm">👰</span>
              </div>
              <h3 className="font-semibold text-[var(--color-brown-900)]">신부 측</h3>
            </div>
            <button
              onClick={() => addAccount("bride")}
              className="text-sm text-[var(--color-coral-500)] font-medium hover:underline"
            >
              + 계좌 추가
            </button>
          </div>
          <div className="space-y-4">
            {formData.accounts.bride.map((account: any, index: number) => (
              <div key={index} className="space-y-3 p-4 bg-[var(--color-cream-bg)]/50 rounded-xl">
                {formData.accounts.bride.length > 1 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[var(--color-brown-500)]">계좌 {index + 1}</span>
                    <button
                      onClick={() => removeAccount("bride", index)}
                      className="text-xs text-red-400 hover:text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <select
                    value={account.bank}
                    onChange={(e) => updateAccount("bride", index, "bank", e.target.value)}
                    className="w-32 px-3 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] focus:outline-none focus:border-[var(--color-coral-400)]"
                  >
                    <option value="">은행 선택</option>
                    {banks.filter(b => b).map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={account.number}
                    onChange={(e) => updateAccount("bride", index, "number", e.target.value)}
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)]"
                  />
                </div>
                <input
                  type="text"
                  value={account.holder}
                  onChange={(e) => updateAccount("bride", index, "holder", e.target.value)}
                  placeholder="예금주"
                  className="w-full px-4 py-3 bg-white border-2 border-[var(--color-cream-dark)] rounded-xl text-sm text-[var(--color-brown-900)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:border-[var(--color-coral-400)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ PHONE PREVIEW ============ */
function PhonePreview({ formData }: { formData: any }) {
  const theme = themes.find((t) => t.id === formData.theme) || themes[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
      {/* Phone frame */}
      <div className="relative w-[280px] h-[580px] bg-[#1a1a1a] rounded-[3rem] p-2 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

        {/* Screen */}
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden" style={{ backgroundColor: theme.color }}>
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            {/* Decorative line */}
            <div className="w-16 h-px bg-[var(--color-coral-400)]/30 mb-6" />

            <p className="text-xs text-[var(--color-brown-500)] tracking-widest uppercase mb-3">Wedding Invitation</p>

            <h2 className="text-2xl font-semibold text-[var(--color-brown-900)] mb-1">{formData.brideName || "신부"}</h2>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-px bg-[var(--color-coral-400)]" />
              <Heart className="w-4 h-4 text-[var(--color-coral-500)] fill-[var(--color-coral-500)]" />
              <div className="w-8 h-px bg-[var(--color-coral-400)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-brown-900)] mb-4">{formData.groomName || "신랑"}</h2>

            <p className="text-sm text-[var(--color-brown-500)] mb-8">
              {formData.weddingDate || "2025.00.00"} {formData.weddingTime || "00:00"}
            </p>

            <p className="text-xs text-[var(--color-brown-700)] whitespace-pre-line leading-relaxed mb-8 max-h-20 overflow-hidden">
              {formData.message?.slice(0, 80) || "소중한 분들을 초대합니다..."}
              {formData.message?.length > 80 ? "..." : ""}
            </p>

            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--color-brown-900)]">{formData.venueName || "예식장"}</p>
              <p className="text-xs text-[var(--color-brown-500)]">{formData.venueFloor}</p>
            </div>

            {/* Decorative line */}
            <div className="w-16 h-px bg-[var(--color-coral-400)]/30 mt-6" />
          </div>
        </div>
      </div>

      {/* Floating label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white rounded-full shadow-lg text-xs font-medium text-[var(--color-brown-700)]">
        미리보기
      </div>
    </motion.div>
  );
}
