import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: { id, userId: user.id },
      include: {
        gallery: { orderBy: { order: "asc" } },
        _count: { select: { rsvpResponses: true, guestbookEntries: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Failed to fetch invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.invitation.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const body = await request.json();
    
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      "groomName", "brideName", "groomFather", "groomMother", "groomOrder", "groomPhone",
      "brideFather", "brideMother", "brideOrder", "bridePhone",
      "weddingTime", "venueName", "venueAddress", "venueFloor", "venueLat", "venueLng",
      "theme", "customization", "invitationMsg", "settings", "accounts",
      "secretEnabled", "secretType", "secretUrl", "secretMessage", "secretTrigger",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.weddingDate) {
      updateData.weddingDate = new Date(body.weddingDate);
    }

    const invitation = await prisma.invitation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Failed to update invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.invitation.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    await prisma.invitation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
