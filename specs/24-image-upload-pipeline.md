# Image Upload Pipeline Specification

## Overview

"연정" 서비스의 이미지 업로드 및 처리 파이프라인 스펙입니다.
웨딩 사진은 고해상도(10MB+)가 많으므로, 클라이언트-서버 양측에서 최적화가 필수입니다.

---

## Upload Limits

| 항목 | 제한 |
|------|------|
| 갤러리 최대 장수 | 30장 |
| 단일 파일 크기 | 20MB (원본 기준) |
| 총 저장 용량 | 청첩장당 500MB |
| 지원 포맷 | JPEG, PNG, HEIC/HEIF, WebP |
| 대표 사진 | 1장 (갤러리 첫 번째 또는 지정) |
| 시크릿 콘텐츠 | 이미지 1장 또는 영상 1개 (30초) |

---

## Upload Flow

### 전체 흐름

```
[사용자 파일 선택]
       ↓
[클라이언트 검증] → 파일 크기, 포맷 체크
       ↓
[클라이언트 압축] → 리사이징 + 품질 조정
       ↓
[Presigned URL 요청] → 서버에서 R2 업로드 URL 발급
       ↓
[Direct Upload] → 클라이언트 → R2 직접 업로드
       ↓
[업로드 완료 알림] → 서버에 완료 통지
       ↓
[서버 후처리] → 썸네일 생성, 메타데이터 저장
       ↓
[갤러리 반영]
```

### 시퀀스 다이어그램

```
Client                    Server                    R2 Storage
  │                         │                           │
  ├─── 파일 선택 ───────────→│                           │
  │                         │                           │
  │←── Presigned URL ───────┤                           │
  │                         │                           │
  ├─── Direct Upload ───────────────────────────────────→│
  │                         │                           │
  │←── 업로드 완료 ─────────────────────────────────────┤
  │                         │                           │
  ├─── 완료 알림 ───────────→│                           │
  │                         ├─── 썸네일 요청 ───────────→│
  │                         │←── 썸네일 생성 ───────────┤
  │                         │                           │
  │←── 갤러리 업데이트 ─────┤                           │
```

---

## Client-Side Processing

### 1. 파일 검증

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function validateFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '지원하지 않는 파일 형식입니다' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '파일 크기가 20MB를 초과합니다' };
  }
  
  return { valid: true };
}
```

### 2. HEIC 변환

iOS 사진은 HEIC 포맷이므로 JPEG 변환 필요:

```typescript
import heic2any from 'heic2any';

async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    return await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    }) as Blob;
  }
  return file;
}
```

### 3. 클라이언트 리사이징

```typescript
const MAX_DIMENSION = 2400; // 긴 변 기준
const JPEG_QUALITY = 0.85;

async function resizeImage(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  
  let { width, height } = img;
  
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas.convertToBlob({
    type: 'image/jpeg',
    quality: JPEG_QUALITY,
  });
}
```

### 4. 업로드 진행률 표시

```typescript
async function uploadWithProgress(
  url: string,
  file: Blob,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    });
    
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

---

## Server-Side Processing

### 1. Presigned URL 발급

```typescript
// app/api/upload/presign/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { invitationId, filename, contentType } = await request.json();
  
  const key = `invitations/${invitationId}/gallery/${crypto.randomUUID()}.jpg`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  
  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
  
  return Response.json({
    uploadUrl: presignedUrl,
    key,
    publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
  });
}
```

### 2. 업로드 완료 처리

```typescript
// app/api/upload/complete/route.ts
export async function POST(request: Request) {
  const { invitationId, key, originalName } = await request.json();
  
  // 이미지 메타데이터 조회 (R2 HeadObject)
  const metadata = await getImageMetadata(key);
  
  // 썸네일 생성 트리거 (Cloudflare Worker 또는 Queue)
  await triggerThumbnailGeneration(key);
  
  // DB 저장
  const galleryImage = await prisma.galleryImage.create({
    data: {
      invitationId,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
      thumbnailUrl: `${process.env.R2_PUBLIC_URL}/${key.replace('/gallery/', '/thumbnails/')}`,
      originalName,
      size: metadata.size,
      width: metadata.width,
      height: metadata.height,
      order: await getNextOrder(invitationId),
    },
  });
  
  return Response.json(galleryImage);
}
```

### 3. 썸네일 생성

Cloudflare Image Resizing 또는 Worker를 활용:

```typescript
// Cloudflare Worker for thumbnail generation
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/thumbnails/')) {
      const originalPath = url.pathname.replace('/thumbnails/', '/gallery/');
      
      return fetch(`${env.R2_PUBLIC_URL}${originalPath}`, {
        cf: {
          image: {
            width: 400,
            height: 400,
            fit: 'cover',
            quality: 80,
            format: 'webp',
          },
        },
      });
    }
    
    return fetch(request);
  },
};
```

### 썸네일 사이즈

| 용도 | 크기 | 포맷 |
|------|------|------|
| 갤러리 그리드 | 400x400 (cover) | WebP |
| Lightbox 프리로드 | 800px (긴 변) | WebP |
| OG 이미지용 | 800x400 (cover) | PNG |
| 대표 사진 | 1200px (긴 변) | WebP |

---

## Storage Structure

### R2 Bucket 구조

```
yeonjeong-images/
├── invitations/
│   └── {invitationId}/
│       ├── gallery/
│       │   ├── {uuid}.jpg          # 원본 (리사이즈됨)
│       │   └── ...
│       ├── thumbnails/
│       │   ├── {uuid}.webp         # 썸네일
│       │   └── ...
│       ├── cover/
│       │   └── og.png              # OG 이미지
│       └── secret/
│           └── {uuid}.jpg          # 시크릿 콘텐츠
└── temp/
    └── {uploadId}/                 # 임시 업로드 (24시간 후 삭제)
```

### 파일 네이밍

```
{uuid}.jpg
  └── UUID v4로 생성, 원본 파일명은 DB에 저장
```

---

## Image Optimization

### Next.js Image Component

```typescript
// 갤러리 이미지 표시
<Image
  src={image.url}
  alt={`갤러리 이미지 ${index + 1}`}
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL={image.blurDataUrl}
  className="object-cover"
/>
```

### Blur Placeholder 생성

```typescript
import { getPlaiceholder } from 'plaiceholder';

async function generateBlurDataUrl(imageUrl: string): Promise<string> {
  const { base64 } = await getPlaiceholder(imageUrl);
  return base64;
}
```

### CDN 설정

```
# Cloudflare Transform Rules
# 이미지 자동 WebP/AVIF 변환

(http.request.uri.path matches "^/invitations/.*/gallery/.*")
→ Polish: Lossy
→ WebP: On
→ Cache TTL: 1 year
```

---

## Upload UI/UX

### Drag & Drop Zone

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌─────────────────┐                      │
│                    │                 │                      │
│                    │   📷 + 사진 추가  │                      │
│                    │                 │                      │
│                    └─────────────────┘                      │
│                                                             │
│              드래그하거나 클릭해서 사진을 추가하세요            │
│              최대 30장 · JPG, PNG, HEIC · 장당 20MB          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 업로드 중 상태

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ ✓    │ │ ✓    │ │ 78%  │ │ ···  │ │ ···  │             │
│  │      │ │      │ │ ████ │ │      │ │      │             │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                             │
│  5장 중 2장 완료 · 업로드 중...                              │
│                                                             │
│                        [취소]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 갤러리 관리

```
┌─────────────────────────────────────────────────────────────┐
│  📸 갤러리 (12/30)                              [+ 추가]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│  │ ⭐   │ │      │ │      │ │      │   ← 드래그로 순서 변경  │
│  │ 대표  │ │      │ │      │ │      │                       │
│  └──────┘ └──────┘ └──────┘ └──────┘                       │
│                                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│  │      │ │      │ │      │ │      │                       │
│  │      │ │      │ │      │ │      │                       │
│  └──────┘ └──────┘ └──────┘ └──────┘                       │
│                                                             │
│  💡 첫 번째 사진이 카카오톡 공유 시 대표 이미지로 사용됩니다    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 이미지 개별 메뉴

```
┌──────────────────┐
│ ⭐ 대표 사진 설정  │
├──────────────────┤
│ 🔄 회전          │
├──────────────────┤
│ 🤫 시크릿 트리거  │
├──────────────────┤
│ 🗑 삭제          │
└──────────────────┘
```

---

## Error Handling

### 에러 케이스

| 에러 | 메시지 | 처리 |
|------|--------|------|
| 파일 형식 오류 | "지원하지 않는 파일 형식입니다" | 파일 스킵 |
| 파일 크기 초과 | "파일 크기가 20MB를 초과합니다" | 파일 스킵 |
| 갤러리 장수 초과 | "최대 30장까지 업로드할 수 있습니다" | 초과분 스킵 |
| 네트워크 오류 | "업로드 중 오류가 발생했습니다" | 재시도 버튼 |
| 저장 용량 초과 | "저장 공간이 부족합니다" | 기존 사진 삭제 유도 |

### 부분 실패 처리

```typescript
const results = await Promise.allSettled(uploadPromises);

const succeeded = results.filter(r => r.status === 'fulfilled');
const failed = results.filter(r => r.status === 'rejected');

if (failed.length > 0) {
  toast.warning(`${succeeded.length}장 업로드 완료, ${failed.length}장 실패`);
}
```

---

## Performance Considerations

### 병렬 업로드

```typescript
const CONCURRENT_UPLOADS = 3;

async function uploadMultiple(files: File[]) {
  const queue = [...files];
  const results: UploadResult[] = [];
  
  async function worker() {
    while (queue.length > 0) {
      const file = queue.shift()!;
      const result = await uploadSingle(file);
      results.push(result);
    }
  }
  
  await Promise.all(
    Array(Math.min(CONCURRENT_UPLOADS, files.length))
      .fill(null)
      .map(() => worker())
  );
  
  return results;
}
```

### 메모리 관리

```typescript
// 대용량 파일 처리 시 메모리 해제
async function processAndUpload(file: File) {
  const resized = await resizeImage(file);
  
  // 원본 참조 해제
  URL.revokeObjectURL(URL.createObjectURL(file));
  
  await upload(resized);
}
```

### Lazy Loading

```typescript
// Intersection Observer로 갤러리 이미지 지연 로드
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        observer.unobserve(img);
      }
    });
  },
  { rootMargin: '100px' }
);
```

---

## Security

### 업로드 권한

```typescript
// Presigned URL 발급 전 권한 확인
const invitation = await prisma.invitation.findUnique({
  where: { id: invitationId },
});

if (invitation.userId !== session.user.id) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 파일 검증 (서버)

```typescript
// Content-Type 재검증
import fileType from 'file-type';

const type = await fileType.fromBuffer(buffer);
if (!type || !ALLOWED_TYPES.includes(type.mime)) {
  throw new Error('Invalid file type');
}
```

### 악성 파일 방지

- 이미지 재인코딩으로 메타데이터/악성코드 제거
- EXIF 데이터 스트립 (GPS 정보 등 개인정보 제거)

```typescript
import sharp from 'sharp';

async function sanitizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate() // EXIF orientation 적용 후
    .jpeg({ quality: 85 })
    .toBuffer();
}
```

---

## Cleanup

### 임시 파일 정리

```typescript
// Cron: 매일 새벽 3시
async function cleanupTempUploads() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // temp/ 폴더의 오래된 파일 삭제
  await r2.send(new DeleteObjectsCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Delete: {
      Objects: await listOldTempFiles(oneDayAgo),
    },
  }));
}
```

### 청첩장 삭제 시

```typescript
// CASCADE로 GalleryImage 삭제 시 R2도 정리
async function deleteInvitationImages(invitationId: string) {
  const prefix = `invitations/${invitationId}/`;
  
  const objects = await listAllObjects(prefix);
  
  if (objects.length > 0) {
    await r2.send(new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: { Objects: objects.map(o => ({ Key: o.Key })) },
    }));
  }
}
```
