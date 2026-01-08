"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import QRCode from "qrcode";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  groomName: string;
  brideName: string;
}

export function ShareModal({
  isOpen,
  onClose,
  slug,
  groomName,
  brideName,
}: ShareModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yeonjeong.kr";
  const invitationUrl = `${baseUrl}/i/${slug}`;

  useEffect(() => {
    if (isOpen && slug) {
      generateQRCode();
    }
  }, [isOpen, slug]);

  async function generateQRCode() {
    setIsGeneratingQR(true);
    try {
      const dataUrl = await QRCode.toDataURL(invitationUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: "#3D3632",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("QR generation failed:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success("링크가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }

  function handleShareKakao() {
    if (typeof window !== "undefined" && (window as unknown as { Kakao?: { Share?: { sendDefault: (options: unknown) => void } } }).Kakao?.Share) {
      const Kakao = (window as unknown as { Kakao: { Share: { sendDefault: (options: unknown) => void } } }).Kakao;
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${brideName} ♥ ${groomName} 결혼합니다`,
          description: "모바일 청첩장으로 초대합니다",
          imageUrl: `${baseUrl}/api/og/${slug}`,
          link: {
            mobileWebUrl: invitationUrl,
            webUrl: invitationUrl,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: invitationUrl,
              webUrl: invitationUrl,
            },
          },
        ],
      });
    } else {
      toast.error("카카오 SDK가 로드되지 않았습니다");
    }
  }

  async function downloadQR(format: "png" | "svg") {
    if (format === "png" && qrDataUrl) {
      const link = document.createElement("a");
      link.download = `qr-${slug}.png`;
      link.href = qrDataUrl;
      link.click();
    } else if (format === "svg") {
      try {
        const svgString = await QRCode.toString(invitationUrl, {
          type: "svg",
          width: 512,
          margin: 2,
          color: {
            dark: "#3D3632",
            light: "#FFFFFF",
          },
        });
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qr-${slug}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error("다운로드에 실패했습니다");
      }
    }
  }

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
          className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display text-brown-900">공유하기</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                &times;
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">청첩장 주소</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={invitationUrl}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  복사
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShareKakao}
                className="flex-1 py-3 bg-yellow-400 text-brown-900 font-medium rounded-xl hover:bg-yellow-500 transition-colors"
              >
                카카오톡 공유
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                링크 복사
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-4 text-center">QR 코드</p>
              <div className="flex justify-center mb-4">
                {isGeneratingQR ? (
                  <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-coral-500 border-t-transparent rounded-full" />
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-40 h-40 rounded-xl"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    QR 생성 중...
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => downloadQR("png")}
                  disabled={!qrDataUrl}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  PNG 다운로드
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  SVG 다운로드
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ShareModal;
