import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error_description = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // OAuth 에러가 있는 경우
  if (error_description) {
    console.error("[Auth Callback] OAuth Error:", error_description);
    return NextResponse.redirect(
      `${origin}/login?error=auth_failed&message=${encodeURIComponent(error_description)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth Callback] Exchange Error:", error.message, error);
    } else {
      console.log("[Auth Callback] Success! User:", data.user?.email);
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else {
    console.error("[Auth Callback] No code received. Params:", Object.fromEntries(searchParams));
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
