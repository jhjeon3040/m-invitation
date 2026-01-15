import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();
const R2_PUBLIC_URL = "https://pub-aec9b72c6d2541adbf2c8cd8e0bc24c3.r2.dev";

async function fixGalleryUrls() {
  console.log("=== Fix Gallery URLs ===\n");

  // 현재 갤러리 이미지 조회
  const images = await prisma.galleryImage.findMany();

  console.log(`Found ${images.length} image(s)\n`);

  for (const image of images) {
    console.log(`ID: ${image.id}`);
    console.log(`  Current URL: ${image.url}`);
    console.log(`  Current Thumbnail: ${image.thumbnailUrl}`);

    // URL이 이미 올바른 형태인지 확인
    if (image.url.startsWith("https://")) {
      console.log(`  ✅ Already correct\n`);
      continue;
    }

    // URL 수정
    const newUrl = `${R2_PUBLIC_URL}/${image.url}`;
    const newThumbnailUrl = `${R2_PUBLIC_URL}/${image.thumbnailUrl}`;

    console.log(`  New URL: ${newUrl}`);
    console.log(`  New Thumbnail: ${newThumbnailUrl}`);

    await prisma.galleryImage.update({
      where: { id: image.id },
      data: {
        url: newUrl,
        thumbnailUrl: newThumbnailUrl,
      },
    });

    console.log(`  ✅ Updated\n`);
  }

  console.log("=== Done ===");
  await prisma.$disconnect();
}

fixGalleryUrls().catch(console.error);
