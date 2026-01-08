"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  isSecret: boolean;
  isHidden: boolean;
  createdAt: string;
}

export default function GuestbookManagementPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    loadGuestbookData();
  }, [invitationId]);

  async function loadGuestbookData() {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/guestbook`);
      if (response.ok) {
        const { data } = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to load guestbook data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleHidden(entryId: string, currentHidden: boolean) {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/guestbook`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, isHidden: !currentHidden }),
      });

      if (response.ok) {
        setEntries((prev) =>
          prev.map((e) => (e.id === entryId ? { ...e, isHidden: !currentHidden } : e))
        );
        toast.success(currentHidden ? "메시지가 공개되었습니다" : "메시지가 숨겨졌습니다");
      }
    } catch (error) {
      toast.error("처리에 실패했습니다");
    }
  }

  async function deleteEntry(entryId: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/invitations/${invitationId}/guestbook`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        toast.success("메시지가 삭제되었습니다");
      }
    } catch (error) {
      toast.error("삭제에 실패했습니다");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const filteredEntries = showHidden ? entries : entries.filter((e) => !e.isHidden);
  const hiddenCount = entries.filter((e) => e.isHidden).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-coral-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-brown-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">대시보드</span>
          </Link>
          <h1 className="font-display text-brown-900">방명록 관리</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            총 {entries.length}개
            {hiddenCount > 0 && ` (숨김 ${hiddenCount}개)`}
          </p>
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="text-sm text-coral-600 hover:underline"
            >
              {showHidden ? "숨긴 메시지 감추기" : "숨긴 메시지 보기"}
            </button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            {entries.length === 0 ? "아직 방명록이 없습니다" : "표시할 방명록이 없습니다"}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`bg-white rounded-xl p-4 ${
                  entry.isHidden ? "opacity-60 border-2 border-dashed border-gray-200" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-brown-900">{entry.name}</span>
                      {entry.isSecret && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          비밀글
                        </span>
                      )}
                      {entry.isHidden && (
                        <span className="text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded">
                          숨김
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{entry.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(entry.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleHidden(entry.id, entry.isHidden)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title={entry.isHidden ? "공개하기" : "숨기기"}
                    >
                      {entry.isHidden ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
