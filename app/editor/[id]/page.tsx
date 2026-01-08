"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

type Section = "basic" | "design" | "message" | "gallery" | "settings" | "accounts";

interface InvitationData {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string | null;
  venueName: string;
  venueAddress: string | null;
  venueFloor: string | null;
  theme: string;
  invitationMsg: string | null;
  settings: {
    rsvp?: { enabled: boolean };
    guestbook?: { enabled: boolean };
  };
}

const sections: { id: Section; icon: string; label: string }[] = [
  { id: "basic", icon: "📋", label: "기본정보" },
  { id: "design", icon: "🎨", label: "디자인" },
  { id: "message", icon: "📝", label: "초대글" },
  { id: "gallery", icon: "📸", label: "갤러리" },
  { id: "settings", icon: "⚙️", label: "설정" },
  { id: "accounts", icon: "💳", label: "계좌" },
];

const themes = [
  { id: "romantic-pink", name: "로맨틱 핑크", color: "#FFE4E9" },
  { id: "classic-ivory", name: "클래식 아이보리", color: "#FDF8F3" },
  { id: "modern-gray", name: "모던 그레이", color: "#F0F4F8" },
];

export default function EditorPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [activeSection, setActiveSection] = useState<Section>("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingTime: "14:00",
    venueName: "",
    venueAddress: "",
    venueFloor: "",
    theme: "romantic-pink",
    message: "",
    rsvpEnabled: true,
    guestbookEnabled: true,
  });

  useEffect(() => {
    async function loadInvitation() {
      try {
        const response = await fetch(`/api/invitations/${invitationId}`);
        if (!response.ok) throw new Error("Failed to load invitation");
        
        const { invitation } = await response.json() as { invitation: InvitationData };
        
        setFormData({
          groomName: invitation.groomName,
          brideName: invitation.brideName,
          weddingDate: invitation.weddingDate?.split("T")[0] || "",
          weddingTime: invitation.weddingTime || "14:00",
          venueName: invitation.venueName,
          venueAddress: invitation.venueAddress || "",
          venueFloor: invitation.venueFloor || "",
          theme: invitation.theme,
          message: invitation.invitationMsg || "",
          rsvpEnabled: invitation.settings?.rsvp?.enabled ?? true,
          guestbookEnabled: invitation.settings?.guestbook?.enabled ?? true,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInvitation();
  }, [invitationId]);

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
          weddingDate: formData.weddingDate,
          weddingTime: formData.weddingTime,
          venueName: formData.venueName,
          venueAddress: formData.venueAddress || null,
          venueFloor: formData.venueFloor || null,
          theme: formData.theme,
          invitationMsg: formData.message,
          settings: {
            rsvp: { enabled: formData.rsvpEnabled },
            guestbook: { enabled: formData.guestbookEnabled },
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      
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
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">청첩장을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-brown-900 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">내 청첩장</span>
          </Link>

          <h1 className="font-display text-brown-900">
            {formData.brideName} <span className="text-coral-400">♥</span> {formData.groomName}
          </h1>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-coral-500 text-white text-sm font-medium rounded-lg hover:bg-coral-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                저장 중
              </>
            ) : saveStatus === "saved" ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                저장됨
              </>
            ) : (
              "저장"
            )}
          </button>
        </div>
      </header>

      <div className="hidden md:flex">
        <aside className="w-56 fixed left-0 top-14 bottom-0 bg-white/80 backdrop-blur-sm border-r border-gray-100 p-4">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === section.id
                    ? "bg-coral-50 text-coral-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 ml-56 mr-80">
          <div className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "basic" && (
                  <BasicInfoSection formData={formData} setFormData={setFormData} />
                )}
                {activeSection === "design" && (
                  <DesignSection formData={formData} setFormData={setFormData} themes={themes} />
                )}
                {activeSection === "message" && (
                  <MessageSection formData={formData} setFormData={setFormData} />
                )}
                {activeSection === "gallery" && <GallerySection invitationId={invitationId} />}
                {activeSection === "settings" && (
                  <SettingsSection formData={formData} setFormData={setFormData} />
                )}
                {activeSection === "accounts" && <AccountsSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <aside className="w-80 fixed right-0 top-14 bottom-0 bg-gray-50 border-l border-gray-100 p-6 flex items-center justify-center">
          <PhonePreview formData={formData} />
        </aside>
      </div>

      <div className="md:hidden">
        <div className="sticky top-14 z-40 bg-white border-b border-gray-100 overflow-x-auto">
          <div className="flex px-2 py-2 gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeSection === section.id
                    ? "bg-coral-50 text-coral-600"
                    : "text-gray-500"
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="p-4 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeSection === "basic" && (
                <BasicInfoSection formData={formData} setFormData={setFormData} />
              )}
              {activeSection === "design" && (
                <DesignSection formData={formData} setFormData={setFormData} themes={themes} />
              )}
              {activeSection === "message" && (
                <MessageSection formData={formData} setFormData={setFormData} />
              )}
              {activeSection === "gallery" && <GallerySection invitationId={invitationId} />}
              {activeSection === "settings" && (
                <SettingsSection formData={formData} setFormData={setFormData} />
              )}
              {activeSection === "accounts" && <AccountsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function BasicInfoSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display text-brown-900 mb-6">기본정보</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">신랑 이름</label>
          <input
            type="text"
            value={formData.groomName}
            onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">신부 이름</label>
          <input
            type="text"
            value={formData.brideName}
            onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">예식일</label>
          <input
            type="date"
            value={formData.weddingDate}
            onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">예식 시간</label>
          <input
            type="time"
            value={formData.weddingTime}
            onChange={(e) => setFormData({ ...formData, weddingTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">예식장</label>
        <input
          type="text"
          value={formData.venueName}
          onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
          placeholder="예식장 이름"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 mb-2"
        />
        <input
          type="text"
          value={formData.venueAddress}
          onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
          placeholder="주소"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 mb-2"
        />
        <input
          type="text"
          value={formData.venueFloor}
          onChange={(e) => setFormData({ ...formData, venueFloor: e.target.value })}
          placeholder="층/홀 (선택)"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
        />
      </div>
    </div>
  );
}

function DesignSection({ formData, setFormData, themes }: { formData: any; setFormData: any; themes: any[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display text-brown-900 mb-6">디자인</h2>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setFormData({ ...formData, theme: theme.id })}
            className={`p-4 rounded-2xl border-2 transition-all ${
              formData.theme === theme.id
                ? "border-coral-400 shadow-lg shadow-coral-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="w-full aspect-[3/4] rounded-xl mb-3"
              style={{ backgroundColor: theme.color }}
            />
            <p className="text-sm font-medium text-brown-900">{theme.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-brown-900">초대글</h2>
        <button className="px-4 py-2 text-sm text-coral-600 bg-coral-50 rounded-lg hover:bg-coral-100 transition-colors">
          ✨ AI로 작성하기
        </button>
      </div>

      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={8}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 resize-none"
        placeholder="초대글을 작성해주세요..."
      />
      <p className="text-sm text-gray-400">{formData.message.length}자</p>
    </div>
  );
}

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
    setUploading((prev) =>
      prev.map((u) => (u.id === uploadItem.id ? { ...u, status: "uploading" } : u))
    );

    try {
      const { uploadGalleryImage } = await import("@/lib/upload/utils");

      await uploadGalleryImage(invitationId, uploadItem.file, (progress) => {
        setUploading((prev) =>
          prev.map((u) => (u.id === uploadItem.id ? { ...u, progress: progress.percent } : u))
        );
      });

      setUploading((prev) =>
        prev.map((u) => (u.id === uploadItem.id ? { ...u, status: "completed", progress: 100 } : u))
      );

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

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  async function handleSetCover(imageId: string) {
    try {
      await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImageId: imageId }),
      });
      setImages((prev) =>
        prev.map((img) => ({ ...img, isCover: img.id === imageId }))
      );
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
      <div className="space-y-6">
        <h2 className="text-xl font-display text-brown-900 mb-6">갤러리</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-coral-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-brown-900">갤러리</h2>
        <span className="text-sm text-gray-500">{totalCount}/{MAX_IMAGES}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-coral-400 bg-coral-50"
            : "border-gray-200 hover:border-coral-300 hover:bg-gray-50"
        } ${totalCount >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="text-4xl mb-3">{isDragOver ? "📥" : "📷"}</div>
        <p className="text-gray-600 font-medium mb-1">
          {totalCount >= MAX_IMAGES ? "최대 장수에 도달했습니다" : "사진을 추가해주세요"}
        </p>
        <p className="text-sm text-gray-400">드래그하거나 클릭해서 업로드</p>
        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP, HEIC · 장당 최대 20MB</p>
      </div>

      {uploading.length > 0 && (
        <div className="space-y-3">
          {uploading.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{item.file.name}</p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-coral-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                {item.status === "uploading" && (
                  <span className="text-xs text-gray-500">{item.progress}%</span>
                )}
                {item.status === "completed" && (
                  <span className="text-coral-500">✓</span>
                )}
                {item.status === "error" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploading((prev) => prev.filter((u) => u.id !== item.id));
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {image.isCover && (
                <div className="absolute top-2 left-2 bg-coral-500 text-white text-xs px-2 py-1 rounded-full">
                  대표
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isCover && (
                  <button
                    onClick={() => handleSetCover(image.id)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    title="대표 사진으로 설정"
                  >
                    ⭐
                  </button>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  title="삭제"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          💡 첫 번째 사진이 카카오톡 공유 시 대표 이미지로 사용됩니다
        </p>
      )}
    </div>
  );
}

function SettingsSection({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display text-brown-900 mb-6">설정</h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
          <div>
            <p className="font-medium text-brown-900">참석 여부 (RSVP)</p>
            <p className="text-sm text-gray-500">하객들의 참석 여부를 받습니다</p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, rsvpEnabled: !formData.rsvpEnabled })}
            className={`w-12 h-7 rounded-full transition-colors ${
              formData.rsvpEnabled ? "bg-coral-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                formData.rsvpEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>

        <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
          <div>
            <p className="font-medium text-brown-900">방명록</p>
            <p className="text-sm text-gray-500">축하 메시지를 받습니다</p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, guestbookEnabled: !formData.guestbookEnabled })}
            className={`w-12 h-7 rounded-full transition-colors ${
              formData.guestbookEnabled ? "bg-coral-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                formData.guestbookEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}

function AccountsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display text-brown-900 mb-6">계좌정보</h2>

      <div className="space-y-6">
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <p className="font-medium text-brown-900 mb-4">신랑 측</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <select className="flex-shrink-0 w-28 px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                <option>국민은행</option>
                <option>신한은행</option>
                <option>우리은행</option>
                <option>하나은행</option>
                <option>농협</option>
                <option>카카오뱅크</option>
                <option>토스뱅크</option>
              </select>
              <input
                type="text"
                placeholder="계좌번호"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="예금주"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <p className="font-medium text-brown-900 mb-4">신부 측</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <select className="flex-shrink-0 w-28 px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                <option>국민은행</option>
                <option>신한은행</option>
                <option>우리은행</option>
                <option>하나은행</option>
                <option>농협</option>
                <option>카카오뱅크</option>
                <option>토스뱅크</option>
              </select>
              <input
                type="text"
                placeholder="계좌번호"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="예금주"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({ formData }: { formData: any }) {
  const theme = themes.find((t) => t.id === formData.theme) || themes[0];

  return (
    <div className="relative w-[260px] h-[520px] bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-950 rounded-b-xl z-20" />

      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: theme.color }}>
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs text-gray-500 font-serif italic mb-2">우리 결혼합니다</p>
          <h2 className="text-xl font-display text-gray-800 mb-1">
            {formData.brideName} <span className="text-coral-400">♥</span> {formData.groomName}
          </h2>
          <p className="text-xs text-gray-500 mb-6">{formData.weddingDate} {formData.weddingTime}</p>

          <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed mb-6">
            {formData.message.slice(0, 100)}...
          </p>

          <p className="text-xs text-gray-500">{formData.venueName}</p>
          <p className="text-[10px] text-gray-400">{formData.venueFloor}</p>
        </div>
      </div>
    </div>
  );
}
