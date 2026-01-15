import { S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Cloudflare R2는 AWS SDK v3의 checksum 기능을 지원하지 않음
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "yeonjeong-images";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

export function getGalleryImageKey(invitationId: string, filename: string): string {
  const uuid = crypto.randomUUID();
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  return `invitations/${invitationId}/gallery/${uuid}.${ext}`;
}

export function getThumbnailKey(galleryKey: string): string {
  return galleryKey.replace("/gallery/", "/thumbnails/").replace(/\.[^.]+$/, ".webp");
}

export function getCoverImageKey(invitationId: string): string {
  return `invitations/${invitationId}/cover/og.png`;
}

export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}
