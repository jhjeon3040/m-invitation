import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createHash } from "crypto";

interface GuestbookRequestBody {
  name: string;
  password: string;
  message: string;
  isSecret?: boolean;
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

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

    const [entries, total] = await Promise.all([
      prisma.guestbookEntry.findMany({
        where: {
          invitationId: invitation.id,
          isHidden: false,
          isApproved: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          message: true,
          isSecret: true,
          createdAt: true,
        },
      }),
      prisma.guestbookEntry.count({
        where: {
          invitationId: invitation.id,
          isHidden: false,
          isApproved: true,
        },
      }),
    ]);

    const maskedEntries = entries.map((entry) => ({
      ...entry,
      message: entry.isSecret ? "비밀 메시지입니다 💌" : entry.message,
    }));

    return NextResponse.json({
      data: maskedEntries,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Guestbook fetch error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "방명록을 불러오는데 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body: GuestbookRequestBody = await request.json();

    if (!body.name || !body.password || !body.message) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "이름, 비밀번호, 메시지를 모두 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    if (body.message.length > 500) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "메시지는 500자 이내로 작성해주세요.",
          },
        },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true, status: true, settings: true },
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

    const settings = invitation.settings as { guestbook?: { requireApproval?: boolean } } | null;
    const requireApproval = settings?.guestbook?.requireApproval ?? false;

    const entry = await prisma.guestbookEntry.create({
      data: {
        invitationId: invitation.id,
        name: body.name,
        passwordHash: hashPassword(body.password),
        message: body.message,
        isSecret: body.isSecret ?? false,
        isApproved: !requireApproval,
      },
      select: {
        id: true,
        name: true,
        message: true,
        isSecret: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        data: {
          ...entry,
          message: entry.isSecret ? "비밀 메시지입니다 💌" : entry.message,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guestbook creation error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "방명록 등록에 실패했습니다. 다시 시도해주세요.",
        },
      },
      { status: 500 }
    );
  }
}
