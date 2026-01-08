import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, getGalleryImageKey } from "@/lib/r2/client";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 30;
const PRESIGN_EXPIRY_SECONDS = 3600;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invitationId, filename, contentType, fileSize } = body;

    if (!invitationId || !filename || !contentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { _count: { select: { gallery: true } } },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invitation._count.gallery >= MAX_GALLERY_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_GALLERY_IMAGES} images allowed` },
        { status: 400 }
      );
    }

    const key = getGalleryImageKey(invitationId, filename);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: PRESIGN_EXPIRY_SECONDS,
    });

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl: `${R2_PUBLIC_URL}/${key}`,
    });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
