# KakaoTalk In-App Browser Optimization Specification

## Overview

"연정" 서비스의 카카오톡 인앱 브라우저 최적화 스펙입니다.
모바일 청첩장 특성상 80% 이상의 트래픽이 카카오톡 인앱 브라우저에서 발생하므로,
해당 환경에 대한 완벽한 최적화가 필수입니다.

---

## 1. 카카오톡 인앱 브라우저 특성

### 1.1. 기술 스펙

| Platform | Engine | User Agent |
|----------|--------|------------|
| **iOS** | WebKit (Safari 기반) | `KAKAOTALK` 포함 |
| **Android** | Chromium (Chrome 기반) | `KAKAOTALK` 포함 |

### 1.2. 주요 제약사항

| Category | Issue | Impact |
|----------|-------|--------|
| **CSS** | `position: fixed` 불안정 | 플로팅 버튼, 헤더 고정 문제 |
| **CSS** | `100vh` 계산 오류 | 레이아웃 잘림 |
| **CSS** | `backdrop-filter` 미지원 (일부) | 블러 효과 깨짐 |
| **Media** | 동영상 autoplay 제한 | 배경 영상 자동 재생 불가 |
| **Media** | 오디오 autoplay 제한 | 배경 음악 자동 재생 불가 |
| **API** | `navigator.clipboard` 제한 | 계좌번호 복사 실패 |
| **API** | `navigator.share` 미지원 | Web Share API 불가 |
| **Storage** | localStorage 제한적 | 세션 유지 문제 |
| **Performance** | 메모리 제한 | 많은 이미지 시 크래시 |

### 1.3. User Agent 감지

```typescript
// lib/browser-detect.ts
export function isKakaoInApp(): boolean {
  if (typeof window === "undefined") return false;
  return /KAKAOTALK/i.test(navigator.userAgent);
}

export function isNaverInApp(): boolean {
  if (typeof window === "undefined") return false;
  return /NAVER/i.test(navigator.userAgent);
}

export function isInAppBrowser(): boolean {
  return isKakaoInApp() || isNaverInApp();
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;
  return {
    isKakao: isKakaoInApp(),
    isNaver: isNaverInApp(),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    isMobile: /Mobile/i.test(ua),
  };
}
```

---

## 2. CSS/Layout 최적화

### 2.1. 100vh 문제 해결

#### 문제
- 카카오톡 인앱 브라우저에서 `100vh`가 실제 뷰포트보다 큼
- 주소창/하단 버튼 영역이 포함되어 콘텐츠가 잘림

#### 해결책

```css
/* globals.css */

/* CSS 변수로 실제 뷰포트 높이 저장 */
:root {
  --vh: 1vh;
}

/* 100vh 대신 사용 */
.full-height {
  height: 100vh; /* Fallback */
  height: calc(var(--vh, 1vh) * 100);
}
```

```typescript
// hooks/useViewportHeight.ts
import { useEffect } from "react";

export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);
}
```

```tsx
// app/layout.tsx
"use client";

import { useViewportHeight } from "@/hooks/useViewportHeight";

export default function RootLayout({ children }) {
  useViewportHeight();
  return <html>{children}</html>;
}
```

### 2.2. position: fixed 대안

#### 문제
- 카카오톡 인앱에서 `position: fixed` 요소가 스크롤 시 떨림
- 키보드 올라올 때 위치 이상

#### 해결책

```css
/* 카카오톡 인앱에서만 적용 */
.kakao-inapp .floating-button {
  position: absolute; /* fixed 대신 absolute */
  bottom: 0;
  /* 부모 요소를 full-height로 설정 */
}

/* 또는 position: sticky 사용 */
.kakao-inapp .sticky-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
```

```tsx
// components/FloatingButton.tsx
"use client";

import { isKakaoInApp } from "@/lib/browser-detect";

export function FloatingButton() {
  const isKakao = isKakaoInApp();
  
  return (
    <button
      className={cn(
        "z-50",
        isKakao ? "absolute bottom-4" : "fixed bottom-4"
      )}
    >
      공유하기
    </button>
  );
}
```

### 2.3. backdrop-filter 대안

```css
/* 블러 효과 - 카카오톡 인앱 대응 */
.glass-effect {
  /* Modern browsers */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Fallback for unsupported browsers */
  background-color: rgba(255, 255, 255, 0.9);
}

/* 카카오톡 인앱에서 blur 미지원 시 */
@supports not (backdrop-filter: blur(10px)) {
  .glass-effect {
    background-color: rgba(255, 255, 255, 0.95);
  }
}
```

---

## 3. Media Handling (동영상/오디오)

### 3.1. 동영상 Autoplay

#### 문제
- 카카오톡 인앱에서 동영상 autoplay 불가 (사용자 인터랙션 필요)

#### 해결책

```tsx
// components/BackgroundVideo.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { isInAppBrowser } from "@/lib/browser-detect";

export function BackgroundVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 인앱 브라우저면 수동 재생 버튼 표시
    if (isInAppBrowser()) {
      setShowPlayButton(true);
    } else {
      // 일반 브라우저는 자동 재생 시도
      videoRef.current?.play().catch(() => {
        setShowPlayButton(true);
      });
    }
  }, []);

  const handlePlay = async () => {
    try {
      await videoRef.current?.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (error) {
      console.error("Video play failed:", error);
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      
      {showPlayButton && !isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
            ▶️
          </div>
        </button>
      )}
    </div>
  );
}
```

### 3.2. 배경 음악 (BGM)

#### 문제
- 인앱 브라우저에서 오디오 autoplay 불가
- 사용자 터치 후에만 재생 가능

#### 해결책

```tsx
// components/BackgroundMusic.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export function BackgroundMusic({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  // 첫 터치 시 음악 재생 시도
  useEffect(() => {
    const handleFirstTouch = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowPrompt(false);
        } catch (error) {
          // 재생 실패 시 버튼 유지
        }
      }
    };

    document.addEventListener("touchstart", handleFirstTouch, { once: true });
    document.addEventListener("click", handleFirstTouch, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleFirstTouch);
      document.removeEventListener("click", handleFirstTouch);
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      
      {/* 음악 재생 프롬프트 (첫 화면) */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <button
            onClick={togglePlay}
            className="px-8 py-4 bg-white rounded-full shadow-lg"
          >
            🎵 음악과 함께 보기
          </button>
        </div>
      )}
      
      {/* 음악 토글 버튼 */}
      <button
        onClick={togglePlay}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-white/80 shadow"
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </>
  );
}
```

---

## 4. Clipboard API (계좌번호 복사)

### 4.1. 문제
- 카카오톡 인앱에서 `navigator.clipboard.writeText()` 실패
- iOS 카카오톡에서 특히 불안정

### 4.2. 해결책: 하이브리드 복사 방식

```typescript
// lib/clipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1차: Clipboard API 시도
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Clipboard API 실패, fallback으로
    }
  }

  // 2차: execCommand fallback (레거시)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const result = document.execCommand("copy");
    document.body.removeChild(textarea);
    
    if (result) return true;
  } catch (error) {
    // execCommand도 실패
  }

  // 3차: 모두 실패 시 false 반환
  return false;
}
```

```tsx
// components/AccountCopy.tsx
"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { isKakaoInApp } from "@/lib/browser-detect";

interface AccountCopyProps {
  bank: string;
  accountNumber: string;
  holder: string;
}

export function AccountCopy({ bank, accountNumber, holder }: AccountCopyProps) {
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleCopy = async () => {
    const text = `${bank} ${accountNumber} ${holder}`;
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // 복사 실패 시 직접 선택 안내
      setShowFallback(true);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{bank}</p>
          <p className="font-mono text-lg">{accountNumber}</p>
          <p className="text-sm">{holder}</p>
        </div>
        
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
      
      {/* 복사 실패 시 fallback UI */}
      {showFallback && (
        <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
          <p className="font-medium">복사가 안 되시나요?</p>
          <p className="text-gray-600 mt-1">
            계좌번호를 길게 눌러 직접 선택하거나,<br/>
            <button
              onClick={() => window.open(window.location.href, "_blank")}
              className="text-primary underline"
            >
              Chrome/Safari로 열기
            </button>
            를 눌러주세요.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 5. 외부 브라우저로 열기

### 5.1. 외부 브라우저 유도

```tsx
// components/OpenInBrowser.tsx
"use client";

import { isKakaoInApp, isNaverInApp } from "@/lib/browser-detect";

export function OpenInBrowser() {
  const isKakao = isKakaoInApp();
  const isNaver = isNaverInApp();
  
  if (!isKakao && !isNaver) return null;

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;
    
    if (isKakao) {
      // 카카오톡: 외부 브라우저로 열기
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    } else if (isNaver) {
      // 네이버: 외부 브라우저로 열기
      window.location.href = `naversearchapp://openExternal?url=${encodeURIComponent(currentUrl)}`;
    }
  };

  return (
    <button
      onClick={handleOpenInBrowser}
      className="fixed bottom-4 left-4 z-50 px-3 py-2 text-xs bg-white/90 rounded-full shadow-lg"
    >
      🌐 {isKakao ? "Chrome" : "Safari"}으로 열기
    </button>
  );
}
```

### 5.2. 특정 기능에서 외부 브라우저 권장

```tsx
// 결제 페이지에서 외부 브라우저 유도
export function PaymentPage() {
  const isInApp = isInAppBrowser();
  
  if (isInApp) {
    return (
      <div className="p-6 text-center">
        <h2>결제를 진행하려면</h2>
        <p>외부 브라우저에서 열어주세요</p>
        <OpenInBrowserButton />
      </div>
    );
  }
  
  return <PaymentForm />;
}
```

---

## 6. 성능 최적화

### 6.1. 이미지 최적화 (메모리 관리)

```tsx
// components/Gallery.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { isInAppBrowser } from "@/lib/browser-detect";

export function Gallery({ images }: { images: string[] }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInApp = isInAppBrowser();

  // 인앱 브라우저에서는 더 적극적인 가상화
  const bufferSize = isInApp ? 2 : 5;

  useEffect(() => {
    const handleScroll = () => {
      // 현재 보이는 이미지 범위만 렌더링
      // ... 가상화 로직
    };

    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="overflow-y-auto">
      {images.map((src, index) => {
        const isVisible = 
          index >= visibleRange.start - bufferSize && 
          index <= visibleRange.end + bufferSize;

        return (
          <div key={index} className="aspect-square">
            {isVisible ? (
              <Image
                src={src}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### 6.2. 애니메이션 최적화

```tsx
// 인앱 브라우저에서 애니메이션 간소화
const animationSettings = isInAppBrowser()
  ? {
      // 간소화된 애니메이션
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    }
  : {
      // 풀 애니메이션
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
    };
```

---

## 7. Font Handling

### 7.1. 웹폰트 최적화

```css
/* 카카오톡 인앱에서 폰트 로딩 지연 대비 */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap; /* FOUT 허용 - 빠른 렌더링 */
}

/* 시스템 폰트 fallback */
body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 
               'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
}
```

### 7.2. 폰트 프리로드

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* 핵심 폰트만 프리로드 */}
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 8. 테스트 체크리스트

### 8.1. 카카오톡 인앱 테스트 항목

| Category | Test Item | Pass Criteria |
|----------|-----------|---------------|
| **Layout** | 전체 높이 표시 | 잘림 없음 |
| **Layout** | 고정 헤더/푸터 | 떨림 없음 |
| **Layout** | 가로/세로 회전 | 정상 렌더링 |
| **Media** | BGM 재생 | 터치 후 재생 |
| **Media** | 동영상 재생 | 터치 후 재생 |
| **Function** | 계좌번호 복사 | 성공 또는 fallback 동작 |
| **Function** | 공유하기 | 정상 동작 |
| **Function** | 지도 열기 | 카카오맵 앱 연결 |
| **Function** | 전화 걸기 | 전화 앱 연결 |
| **Performance** | 갤러리 스크롤 | 버벅임 없음 |
| **Performance** | 애니메이션 | 부드러움 |

### 8.2. 테스트 환경

| Device | App Version | Test Priority |
|--------|-------------|---------------|
| iPhone 15 Pro | 최신 | High |
| iPhone 13 | 최신 | High |
| Galaxy S24 | 최신 | High |
| Galaxy S21 | 최신 | Medium |
| iPhone SE | 최신 | Medium |
| Galaxy A | 최신 | Low |

---

## 9. 디버깅

### 9.1. 원격 디버깅 (Android)

```bash
# Chrome DevTools로 Android 카카오톡 인앱 디버깅
chrome://inspect/#devices

# 1. 안드로이드 개발자 옵션 > USB 디버깅 활성화
# 2. 카카오톡에서 청첩장 열기
# 3. Chrome에서 inspect
```

### 9.2. 원격 디버깅 (iOS)

```bash
# Safari Web Inspector 사용
# 1. iPhone 설정 > Safari > 고급 > 웹 인스펙터 활성화
# 2. Mac Safari > 개발자용 > [iPhone 이름] > [페이지]

# 주의: 카카오톡 인앱은 직접 디버깅 불가
# → Safari에서 같은 URL 열어서 테스트
```

### 9.3. 로깅

```typescript
// 카카오톡 인앱 전용 로깅
if (isKakaoInApp()) {
  console.log("[KakaoInApp] Detected");
  console.log("[KakaoInApp] User Agent:", navigator.userAgent);
  console.log("[KakaoInApp] Screen:", screen.width, "x", screen.height);
  console.log("[KakaoInApp] Viewport:", window.innerWidth, "x", window.innerHeight);
}
```

---

## 10. 알려진 이슈 및 Workaround

### 10.1. 이슈 목록

| Issue | Workaround | Status |
|-------|------------|--------|
| iOS 카카오톡 100vh 오버플로우 | CSS 변수 + JS 계산 | ✅ 해결됨 |
| Android fixed 떨림 | sticky 또는 absolute 사용 | ✅ 해결됨 |
| clipboard.writeText 실패 | execCommand fallback | ✅ 해결됨 |
| 오디오 autoplay 불가 | 사용자 인터랙션 요구 | ✅ 우회 |
| 동영상 autoplay 불가 | 재생 버튼 표시 | ✅ 우회 |
| Web Share API 미지원 | 직접 공유 UI 구현 | ✅ 해결됨 |
| localStorage 제한 | sessionStorage + 쿠키 병용 | ⚠️ 모니터링 |

### 10.2. 정기 점검

| Check | Frequency | Owner |
|-------|-----------|-------|
| 카카오톡 앱 업데이트 후 테스트 | 앱 업데이트 시 | QA |
| iOS 메이저 업데이트 후 테스트 | iOS 업데이트 시 | QA |
| Android 메이저 업데이트 후 테스트 | Android 업데이트 시 | QA |
| 알려진 이슈 재검토 | 월 1회 | Dev |
