import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface ValidateRequestBody {
  code: string;
}

const COUPON_PATTERNS: Record<string, RegExp> = {
  standard: /^YJ-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  promo: /^PROMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  partner: /^PTN-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  gift: /^GIFT-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
};

function isValidCouponFormat(code: string): boolean {
  return Object.values(COUPON_PATTERNS).some((pattern) => pattern.test(code));
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequestBody = await request.json();
    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "쿠폰 코드를 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    if (!isValidCouponFormat(code)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FORMAT",
            message: "쿠폰 코드 형식이 올바르지 않습니다.",
          },
        },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        type: true,
        status: true,
        validFrom: true,
        validUntil: true,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "존재하지 않는 쿠폰입니다.",
          },
        },
        { status: 404 }
      );
    }

    const now = new Date();

    if (coupon.status === "USED") {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_USED",
            message: "이미 사용된 쿠폰입니다.",
          },
        },
        { status: 400 }
      );
    }

    if (coupon.status === "EXPIRED" || coupon.validUntil < now) {
      return NextResponse.json(
        {
          error: {
            code: "EXPIRED",
            message: "만료된 쿠폰입니다.",
          },
        },
        { status: 400 }
      );
    }

    if (coupon.status === "REVOKED") {
      return NextResponse.json(
        {
          error: {
            code: "REVOKED",
            message: "취소된 쿠폰입니다.",
          },
        },
        { status: 400 }
      );
    }

    if (coupon.validFrom > now) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_YET_VALID",
            message: `아직 사용 기간이 아닙니다. ${coupon.validFrom.toLocaleDateString("ko-KR")}부터 사용 가능합니다.`,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: {
        valid: true,
        type: coupon.type.toLowerCase(),
        expiresAt: coupon.validUntil.toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "쿠폰 검증에 실패했습니다. 다시 시도해주세요.",
        },
      },
      { status: 500 }
    );
  }
}
