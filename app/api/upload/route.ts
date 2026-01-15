import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, getGalleryImageKey, getThumbnailKey } from "@/lib/r2/client";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 30;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const invitationId = formData.get("invitationId") as string | null;
    const originalName = formData.get("originalName") as string | null;
    const width = parseInt(formData.get("width") as string) || 0;
    const height = parseInt(formData.get("height") as string) || 0;

    if (!file || !invitationId || !originalName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
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

    const key = getGalleryImageKey(invitationId, originalName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // DB 저장 시도 - 실패하면 R2 파일 삭제 (롤백)
    try {
      const existingCount = await prisma.galleryImage.count({
        where: { invitationId },
      });

      const isFirstImage = existingCount === 0;

      const galleryImage = await prisma.galleryImage.create({
        data: {
          invitationId,
          url: `${R2_PUBLIC_URL}/${key}`,
          thumbnailUrl: `${R2_PUBLIC_URL}/${key}`, // 썸네일 미생성 - 원본 사용
          originalName,
          size: file.size,
          width,
          height,
          order: existingCount,
          isCover: isFirstImage,
        },
      });

      return NextResponse.json({
        galleryImage,
        key,
        publicUrl: `${R2_PUBLIC_URL}/${key}`,
      });
    } catch (dbError) {
      // DB 저장 실패 시 R2 파일 삭제 (고아 파일 방지)
      console.error("DB save failed, rolling back R2 upload:", dbError);
      try {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        }));
      } catch (deleteError) {
        console.error("Failed to rollback R2 file:", deleteError);
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
