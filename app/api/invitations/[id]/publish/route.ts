import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

interface PublishRequestBody {
  couponCode: string;
  slug: string;
}

const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "logout",
  "dashboard",
  "editor",
  "auth",
  "i",
  "demo",
  "about",
  "pricing",
  "faq",
  "terms",
  "privacy",
  "contact",
  "help",
  "support",
];

function isValidSlug(slug: string): boolean {
  if (slug.length < 3 || slug.length > 30) return false;
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) return false;
  return /^[a-z0-9가-힣-]+$/.test(slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "로그인이 필요합니다.",
          },
        },
        { status: 401 }
      );
    }
    
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    
    if (!dbUser) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "사용자 정보를 찾을 수 없습니다.",
          },
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: PublishRequestBody = await request.json();

    const couponCode = body.couponCode?.trim().toUpperCase();
    const slug = body.slug?.trim().toLowerCase();

    if (!couponCode || !slug) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "쿠폰 코드와 청첩장 주소를 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_SLUG",
            message: "주소는 영문 소문자, 숫자, 한글, 하이픈만 사용 가능합니다. (3~30자)",
          },
        },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true } },
        gallery: { select: { id: true }, take: 1 },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "청첩장을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    if (invitation.user.id !== dbUser.id) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "권한이 없습니다.",
          },
        },
        { status: 403 }
      );
    }

    if (invitation.status !== "DRAFT") {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_PUBLISHED",
            message: "이미 발행된 청첩장입니다.",
          },
        },
        { status: 400 }
      );
    }

    const missingFields: string[] = [];
    if (!invitation.weddingDate) missingFields.push("예식일");
    if (!invitation.weddingTime) missingFields.push("예식 시간");
    if (!invitation.venueName) missingFields.push("예식장");
    if (!invitation.groomName) missingFields.push("신랑 이름");
    if (!invitation.brideName) missingFields.push("신부 이름");
    if (invitation.gallery.length === 0) missingFields.push("대표 사진");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_REQUIRED",
            message: `필수 정보가 누락되었습니다: ${missingFields.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingSlug && existingSlug.id !== id) {
      return NextResponse.json(
        {
          error: {
            code: "SLUG_TAKEN",
            message: "이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.",
          },
        },
        { status: 409 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon) {
      return NextResponse.json(
        {
          error: {
            code: "COUPON_NOT_FOUND",
            message: "존재하지 않는 쿠폰입니다.",
          },
        },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.status !== "ACTIVE") {
      const errorMessages: Record<string, string> = {
        USED: "이미 사용된 쿠폰입니다.",
        EXPIRED: "만료된 쿠폰입니다.",
        REVOKED: "취소된 쿠폰입니다.",
      };
      return NextResponse.json(
        {
          error: {
            code: `COUPON_${coupon.status}`,
            message: errorMessages[coupon.status] || "유효하지 않은 쿠폰입니다.",
          },
        },
        { status: 400 }
      );
    }

    if (coupon.validFrom > now || coupon.validUntil < now) {
      return NextResponse.json(
        {
          error: {
            code: "COUPON_INVALID_PERIOD",
            message: "쿠폰 사용 기간이 아닙니다.",
          },
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          status: "USED",
          usedAt: now,
          usedBy: dbUser.id,
        },
      }),
      prisma.invitation.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          slug,
          publishedAt: now,
          couponId: coupon.id,
        },
      }),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yeonjeong.kr";

    return NextResponse.json({
      data: {
        success: true,
        url: `${baseUrl}/i/${slug}`,
        slug,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "청첩장 발행에 실패했습니다. 다시 시도해주세요.",
        },
      },
      { status: 500 }
    );
  }
}
