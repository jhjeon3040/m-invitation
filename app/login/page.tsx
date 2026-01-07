"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signInWithKakao, signInWithNaver, getAuthErrorMessage } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="h-14 w-24 bg-gray-100 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded mx-auto animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<"kakao" | "naver" | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const urlError = useMemo(() => {
    const errorParam = searchParams.get("error");
    return errorParam === "auth_failed" ? "로그인에 실패했습니다. 다시 시도해주세요." : null;
  }, [searchParams]);

  const error = loginError || urlError;

  const handleKakaoLogin = async () => {
    try {
      setLoading("kakao");
      setLoginError(null);
      await signInWithKakao();
    } catch (err) {
      setLoginError(getAuthErrorMessage(err));
      setLoading(null);
    }
  };

  const handleNaverLogin = async () => {
    try {
      setLoading("naver");
      setLoginError(null);
      await signInWithNaver();
    } catch (err) {
      setLoginError(getAuthErrorMessage(err));
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-serif text-gray-900 mb-3"
          >
            연정
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-500 text-sm tracking-wider"
          >
            사랑의 시작을 담다
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-3"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleKakaoLogin}
            disabled={loading !== null}
            className={cn(
              "w-full py-4 rounded-xl font-medium text-sm transition-all duration-200",
              "bg-[#FEE500] text-[#191919] hover:bg-[#FDD700]",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading === "kakao" ? (
              <LoadingSpinner className="text-[#191919]" />
            ) : (
              <>
                <KakaoIcon />
                카카오로 시작하기
              </>
            )}
          </button>

          <button
            onClick={handleNaverLogin}
            disabled={loading !== null}
            className={cn(
              "w-full py-4 rounded-xl font-medium text-sm transition-all duration-200",
              "bg-[#03C75A] text-white hover:bg-[#02B350]",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading === "naver" ? (
              <LoadingSpinner className="text-white" />
            ) : (
              <>
                <NaverIcon />
                네이버로 시작하기
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-xs text-gray-400 mt-8 leading-relaxed"
        >
          시작하면{" "}
          <Link href="/terms" className="underline hover:text-gray-600">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" className="underline hover:text-gray-600">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </motion.p>
      </motion.div>
    </div>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-5 w-5", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0.5C4.02944 0.5 0 3.69 0 7.62C0 10.0467 1.55733 12.1787 3.93067 13.4213L2.93333 17.0213C2.84 17.3547 3.22133 17.6213 3.51333 17.4347L7.84 14.6547C8.22 14.7013 8.60667 14.74 9 14.74C13.9706 14.74 18 11.55 18 7.62C18 3.69 13.9706 0.5 9 0.5Z"
        fill="#191919"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.1849 9.51L5.57489 0H0V18H5.81511V8.49L12.4251 18H18V0H12.1849V9.51Z"
        fill="white"
      />
    </svg>
  );
}
