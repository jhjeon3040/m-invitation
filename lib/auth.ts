"use client";

import { createClient } from "@/lib/supabase/client";

export async function signInWithKakao() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        scope: "profile_nickname profile_image account_email",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithNaver() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "naver" as "kakao",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credentials": "로그인 정보가 올바르지 않습니다.",
  "auth/user-not-found": "존재하지 않는 계정입니다.",
  "auth/popup-closed": "로그인이 취소되었습니다.",
  "auth/network-error": "네트워크 오류가 발생했습니다.",
  default: "로그인에 실패했습니다. 다시 시도해주세요.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    return AUTH_ERRORS[code] || AUTH_ERRORS.default;
  }
  return AUTH_ERRORS.default;
}
