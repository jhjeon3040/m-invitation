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

    const entries = await prisma.guestbookEntry.findMany({
      where: { invitationId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        message: true,
        isSecret: true,
        isHidden: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: entries,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Guestbook fetch error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "방명록을 불러오는데 실패했습니다." } },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await request.json();
    const { entryId, isHidden, isSecret } = body;

    const entry = await prisma.guestbookEntry.findUnique({
      where: { id: entryId },
      include: { invitation: { select: { userId: true } } },
    });

    if (!entry) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "방명록을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    if (entry.invitation.userId !== dbUser.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "권한이 없습니다." } },
        { status: 403 }
      );
    }

    const updated = await prisma.guestbookEntry.update({
      where: { id: entryId },
      data: {
        ...(typeof isHidden === "boolean" && { isHidden }),
        ...(typeof isSecret === "boolean" && { isSecret }),
      },
      select: {
        id: true,
        name: true,
        message: true,
        isSecret: true,
        isHidden: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: updated,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Guestbook update error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "방명록 수정에 실패했습니다." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const body = await request.json();
    const { entryId } = body;

    const entry = await prisma.guestbookEntry.findUnique({
      where: { id: entryId },
      include: { invitation: { select: { userId: true } } },
    });

    if (!entry) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "방명록을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    if (entry.invitation.userId !== dbUser.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "권한이 없습니다." } },
        { status: 403 }
      );
    }

    await prisma.guestbookEntry.delete({ where: { id: entryId } });

    return NextResponse.json({
      data: { success: true },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Guestbook delete error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "방명록 삭제에 실패했습니다." } },
      { status: 500 }
    );
  }
}
