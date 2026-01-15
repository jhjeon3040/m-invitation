import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2/client";

function extractKeyFromUrl(url: string): string | null {
  if (!R2_PUBLIC_URL) return null;
  if (url.startsWith(R2_PUBLIC_URL)) {
    return url.slice(R2_PUBLIC_URL.length + 1); // +1 for the slash
  }
  return null;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 이미지와 연결된 invitation 조회
    const galleryImage = await prisma.galleryImage.findUnique({
      where: { id },
      include: { invitation: true },
    });

    if (!galleryImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // 소유권 확인
    if (galleryImage.invitation.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // R2에서 파일 삭제
    const key = extractKeyFromUrl(galleryImage.url);
    if (key) {
      try {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        }));
      } catch (r2Error) {
        console.error("Failed to delete from R2:", r2Error);
        // R2 삭제 실패해도 DB 삭제는 진행 (고아 파일보다 DB 정합성 우선)
      }
    }

    // DB에서 삭제
    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
