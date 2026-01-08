import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Side } from "@prisma/client";

interface RsvpRequestBody {
  name: string;
  phone?: string;
  attending: boolean;
  mealCount?: number;
  side: "groom" | "bride";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body: RsvpRequestBody = await request.json();

    if (!body.name || typeof body.attending !== "boolean" || !body.side) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "필수 항목을 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true, status: true },
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

    if (invitation.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "비공개 청첩장입니다.",
          },
        },
        { status: 403 }
      );
    }

    const rsvpResponse = await prisma.rsvpResponse.create({
      data: {
        invitationId: invitation.id,
        name: body.name,
        phone: body.phone || null,
        attending: body.attending,
        mealCount: body.attending ? (body.mealCount ?? 1) : 0,
        side: body.side.toUpperCase() as Side,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: rsvpResponse.id,
          success: true,
          message: body.attending
            ? "참석 여부가 전달되었습니다. 감사합니다!"
            : "마음을 전해주셔서 감사합니다.",
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "참석 여부 전달에 실패했습니다. 다시 시도해주세요.",
        },
      },
      { status: 500 }
    );
  }
}
