import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groomName, brideName, weddingDate, weddingTime, venueName, venueAddress } = body;

    if (!groomName || !brideName || !weddingDate || !venueName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      const provider = (authUser.app_metadata?.provider || "kakao").toUpperCase() as "KAKAO" | "NAVER";
      
      user = await prisma.user.create({
        data: {
          supabaseId: authUser.id,
          provider,
          providerId: authUser.user_metadata?.provider_id || authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || "사용자",
          profileImage: authUser.user_metadata?.avatar_url,
        },
      });
    }

    const slug = `${groomName}-${brideName}`.toLowerCase().replace(/\s+/g, "-");
    
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.invitation.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const invitation = await prisma.invitation.create({
      data: {
        userId: user.id,
        slug: uniqueSlug,
        groomName,
        brideName,
        weddingDate: new Date(weddingDate),
        weddingTime,
        venueName,
        venueAddress: venueAddress || null,
        invitationMsg: `서로에게 스며든 두 사람이\n사랑으로 하나 되려 합니다.\n\n바쁘시더라도 귀한 걸음 하시어\n축복해 주시면 감사하겠습니다.`,
        settings: {
          rsvp: { enabled: true, askMealCount: true },
          guestbook: { enabled: true, allowSecret: true },
        },
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ invitations: [] });
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rsvpResponses: true, guestbookEntries: true },
        },
      },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
