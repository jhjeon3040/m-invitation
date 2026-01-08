import { NextResponse } from "next/server";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, getThumbnailKey } from "@/lib/r2/client";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invitationId, key, originalName, width, height } = body;

    if (!invitationId || !key || !originalName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let fileSize = 0;
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      });
      const headResult = await r2Client.send(headCommand);
      fileSize = headResult.ContentLength || 0;
    } catch {
      return NextResponse.json({ error: "File not found in storage" }, { status: 404 });
    }

    const existingCount = await prisma.galleryImage.count({
      where: { invitationId },
    });

    const isFirstImage = existingCount === 0;

    const galleryImage = await prisma.galleryImage.create({
      data: {
        invitationId,
        url: `${R2_PUBLIC_URL}/${key}`,
        thumbnailUrl: `${R2_PUBLIC_URL}/${getThumbnailKey(key)}`,
        originalName,
        size: fileSize,
        width: width || 0,
        height: height || 0,
        order: existingCount,
        isCover: isFirstImage,
      },
    });

    return NextResponse.json({ galleryImage });
  } catch (error) {
    console.error("Failed to complete upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
