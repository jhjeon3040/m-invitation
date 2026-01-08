import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." } },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "사용자 정보를 찾을 수 없습니다." } },
        { status: 401 }
      );
    }

    const { id } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "청첩장을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    if (invitation.userId !== dbUser.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "권한이 없습니다." } },
        { status: 403 }
      );
    }

    const responses = await prisma.rsvpResponse.findMany({
      where: { invitationId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        attending: true,
        mealCount: true,
        side: true,
        createdAt: true,
      },
    });

    const summary = {
      total: responses.length,
      attending: responses.filter((r) => r.attending).length,
      notAttending: responses.filter((r) => !r.attending).length,
      mealCount: responses.reduce((sum, r) => sum + r.mealCount, 0),
      groomSide: responses.filter((r) => r.side === "GROOM").length,
      brideSide: responses.filter((r) => r.side === "BRIDE").length,
    };

    return NextResponse.json({
      data: { summary, responses },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("RSVP fetch error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "RSVP 목록을 불러오는데 실패했습니다." } },
      { status: 500 }
    );
  }
}
