# SEO & Social Sharing Specification

## Overview

"연정" 서비스의 SEO 및 소셜 공유 최적화 문서입니다.
청첩장의 주요 공유 채널은 **카카오톡**이므로, 카카오 최적화가 핵심입니다.

---

## Meta Tags Strategy

### Landing Page (yeonjeong.kr)

```html
<!-- Primary Meta -->
<title>연정 - 사랑의 시작을 담다 | 프리미엄 모바일 청첩장</title>
<meta name="description" content="AI가 만드는 감성 초대글, 3분 만에 완성하는 프리미엄 모바일 청첩장. 10,000+ 커플이 선택한 연정에서 세상에 단 하나뿐인 청첩장을 만들어보세요.">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="연정">
<meta property="og:title" content="연정 - 사랑의 시작을 담다">
<meta property="og:description" content="AI가 만드는 감성 초대글, 3분 만에 완성하는 프리미엄 모바일 청첩장">
<meta property="og:image" content="https://yeonjeong.kr/og/landing.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://yeonjeong.kr">
<meta property="og:locale" content="ko_KR">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="연정 - 사랑의 시작을 담다">
<meta name="twitter:description" content="AI가 만드는 감성 초대글, 3분 만에 완성하는 프리미엄 모바일 청첩장">
<meta name="twitter:image" content="https://yeonjeong.kr/og/landing.png">
```

### Invitation Page (yeonjeong.kr/{slug})

```html
<!-- Dynamic Meta -->
<title>{신랑이름} ♥ {신부이름} 결혼합니다</title>
<meta name="description" content="{날짜} {시간} {장소}에서 열리는 {신랑이름}, {신부이름}의 결혼식에 초대합니다.">

<!-- Open Graph (Kakao 최적화) -->
<meta property="og:type" content="website">
<meta property="og:title" content="{신랑이름} ♥ {신부이름} 결혼합니다">
<meta property="og:description" content="{날짜} {시간} | {장소}">
<meta property="og:image" content="https://cdn.yeonjeong.kr/og/{invitationId}.png">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="400">
<meta property="og:url" content="https://yeonjeong.kr/{slug}">

<!-- 로봇 설정 (청첩장은 인덱싱 제외) -->
<meta name="robots" content="noindex, nofollow">
```

---

## Open Graph Image Generation

### 자동 생성 (기본)

| Spec | Value |
|------|-------|
| Size | 800 x 400 px |
| Format | PNG |
| Generation | @vercel/og (Edge Function) |

#### 레이아웃
```
┌────────────────────────────────────────────┐
│                                            │
│     [대표 사진]     │   {신랑} ♥ {신부}     │
│     (정사각형)      │                       │
│                    │   {날짜}               │
│                    │   {장소}               │
│                    │                       │
│                    │   연정                 │
└────────────────────────────────────────────┘
```

#### 생성 코드 예시
```typescript
// app/api/og/[slug]/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request) {
  const invitation = await getInvitationBySlug(slug);
  
  return new ImageResponse(
    (
      <div style={{ display: 'flex', ... }}>
        <img src={invitation.coverImage} style={{ ... }} />
        <div>
          <h1>{invitation.groomName} ♥ {invitation.brideName}</h1>
          <p>{formatDate(invitation.weddingDate)}</p>
          <p>{invitation.venueName}</p>
        </div>
      </div>
    ),
    { width: 800, height: 400 }
  );
}
```

### 직접 업로드 (선택)
- 사용자가 커스텀 OG 이미지 업로드 가능
- 권장 사이즈: 800x400 또는 1200x630

---

## 카카오톡 공유 최적화

### Kakao SDK 초기화
```typescript
// lib/kakao.ts
export function initKakao() {
  if (typeof window !== 'undefined' && window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }
}
```

### 공유 버튼 구현
```typescript
function shareToKakao(invitation: Invitation) {
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
      description: `${formatDate(invitation.weddingDate)} | ${invitation.venueName}`,
      imageUrl: `https://cdn.yeonjeong.kr/og/${invitation.id}.png`,
      link: {
        mobileWebUrl: `https://yeonjeong.kr/${invitation.slug}`,
        webUrl: `https://yeonjeong.kr/${invitation.slug}`,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: `https://yeonjeong.kr/${invitation.slug}`,
          webUrl: `https://yeonjeong.kr/${invitation.slug}`,
        },
      },
    ],
  });
}
```

### 카카오톡 미리보기 최적화

| 요소 | 권장 |
|------|------|
| 제목 | 40자 이내 |
| 설명 | 80자 이내 |
| 이미지 | 800x400px, < 500KB |
| 이미지 비율 | 2:1 |

### 디버깅
```
https://developers.kakao.com/tool/debugger/sharing
```
- 캐시 초기화 버튼으로 OG 갱신 확인

---

## URL 링크 복사

### 구현
```typescript
async function copyLink(slug: string) {
  const url = `https://yeonjeong.kr/${slug}`;
  
  try {
    await navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다');
  } catch {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toast.success('링크가 복사되었습니다');
  }
}
```

---

## QR 코드 생성

### 스펙
| Spec | Value |
|------|-------|
| Size | 512 x 512 px |
| Format | PNG, SVG |
| Error Correction | L (7%) |
| Library | qrcode (npm) |

### 생성
```typescript
import QRCode from 'qrcode';

async function generateQR(slug: string): Promise<string> {
  const url = `https://yeonjeong.kr/${slug}`;
  return await QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    color: {
      dark: '#5D4E4E',  // Brown
      light: '#FFFFFF',
    },
  });
}
```

### 다운로드 옵션
- PNG (512x512) - 일반 인쇄용
- PNG (1024x1024) - 고해상도 인쇄용
- SVG - 벡터 (무한 확대)

---

## 구조화된 데이터 (Schema.org)

### Landing Page
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "연정",
  "description": "프리미엄 모바일 청첩장 서비스",
  "url": "https://yeonjeong.kr",
  "applicationCategory": "LifestyleApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  }
}
```

### Invitation Page
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{신랑이름} & {신부이름} 결혼식",
  "startDate": "{weddingDate}T{weddingTime}:00+09:00",
  "location": {
    "@type": "Place",
    "name": "{venueName}",
    "address": "{venueAddress}"
  },
  "organizer": {
    "@type": "Person",
    "name": "{groomName}, {brideName}"
  }
}
```

---

## Sitemap & Robots

### robots.txt
```
User-agent: *
Allow: /

# 청첩장은 인덱싱 제외
Disallow: /*/

# 시스템 경로
Disallow: /api/
Disallow: /dashboard/
Disallow: /editor/
Disallow: /admin/

Sitemap: https://yeonjeong.kr/sitemap.xml
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yeonjeong.kr</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yeonjeong.kr/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yeonjeong.kr/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

---

## Analytics Integration

### Google Analytics 4
```typescript
// Google tag (gtag.js)
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
</Script>
```

### 추적 이벤트
| Event | Trigger | Parameters |
|-------|---------|------------|
| `page_view` | 페이지 로드 | page_path |
| `invitation_view` | 청첩장 조회 | invitation_id, source |
| `share_kakao` | 카카오 공유 | invitation_id |
| `share_link` | 링크 복사 | invitation_id |
| `rsvp_submit` | RSVP 제출 | invitation_id, attending |
| `guestbook_write` | 방명록 작성 | invitation_id |

---

## Performance Optimization

### Image Optimization
```typescript
// next.config.ts
{
  images: {
    domains: ['cdn.yeonjeong.kr'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}
```

### Font Loading
```typescript
// app/layout.tsx
import { Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google';

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-display',
});
```

### Preloading
```html
<!-- 중요 리소스 프리로드 -->
<link rel="preload" href="/fonts/NanumMyeongjo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://cdn.yeonjeong.kr">
<link rel="dns-prefetch" href="https://cdn.yeonjeong.kr">
```

---

## Cache Strategy

### Static Assets
```
Cache-Control: public, max-age=31536000, immutable
```

### Dynamic Content (청첩장)
```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### OG Images
```
Cache-Control: public, max-age=86400
```
- 수정 시 URL에 버전 파라미터 추가: `?v={updatedAt}`
