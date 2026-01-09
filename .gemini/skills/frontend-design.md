# Frontend Design Skill

> 토스(Toss) 스타일의 깔끔하고 미니멀한 UI를 생성하는 디자인 시스템

## Core Principles (핵심 원칙)

### 1. No Gradients (그라데이션 금지)
- 배경, 버튼, 텍스트 등 모든 요소에 그라데이션 사용 금지
- 단색(Solid Color)만 사용
- 깊이감은 그림자나 레이어 구분으로 표현

### 2. White-Based Theme (화이트 기반 테마)
- 주 배경색은 순수 화이트 `#FFFFFF`
- 카드/섹션 구분은 연한 그레이 배경 `#F9FAFB` 사용
- 깨끗하고 넓은 느낌을 주는 것이 목표

### 3. Clean & Minimal (깔끔하고 미니멀)
- 불필요한 장식 요소 제거
- 정보 전달에 집중
- 여백을 충분히 활용

---

## Color System (색상 시스템)

### Background Colors
```
--bg-primary: #FFFFFF      /* 메인 배경 */
--bg-secondary: #F9FAFB    /* 카드/섹션 배경 */
--bg-tertiary: #F3F4F6     /* 인풋 배경, 비활성 영역 */
```

### Text Colors
```
--text-primary: #191F28    /* 제목, 중요 텍스트 (검정 대신) */
--text-secondary: #4E5968  /* 본문 텍스트 */
--text-tertiary: #8B95A1   /* 보조 텍스트, 플레이스홀더 */
--text-disabled: #B0B8C1   /* 비활성 텍스트 */
```

### Accent Colors
```
--accent-blue: #3182F6     /* 주요 액션, 링크 */
--accent-red: #F04452      /* 에러, 삭제 */
--accent-green: #03B26C    /* 성공, 완료 */
--accent-orange: #F59F00   /* 경고, 주의 */
```

### Border & Divider
```
--border-light: #F2F4F6    /* 얇은 구분선 */
--border-default: #E5E8EB  /* 기본 테두리 */
```

---

## Typography (타이포그래피)

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Segoe UI', sans-serif;
```

### Font Scale (4단계만 사용)
| Role | Size | Weight | Line Height | Tailwind |
|------|------|--------|-------------|----------|
| Display | 28px | 700 | 1.3 | `text-[28px] font-bold leading-tight` |
| Title | 20px | 600 | 1.4 | `text-xl font-semibold` |
| Body | 16px | 400 | 1.6 | `text-base` |
| Caption | 14px | 400 | 1.5 | `text-sm text-[#8B95A1]` |

### Typography Rules
- 제목과 본문의 굵기 대비로 계층 표현
- 한 화면에 3단계 이상의 폰트 크기 사용 지양
- 긴 텍스트는 `max-w-prose` 또는 `max-w-md`로 가독성 확보

---

## Spacing System (여백 시스템)

### Base Unit: 8px
모든 여백은 8px 단위로 설계

| Token | Value | Tailwind | 용도 |
|-------|-------|----------|------|
| xs | 4px | `p-1`, `gap-1` | 아이콘-텍스트 간격 |
| sm | 8px | `p-2`, `gap-2` | 인라인 요소 간격 |
| md | 16px | `p-4`, `gap-4` | 컴포넌트 내부 패딩 |
| lg | 24px | `p-6`, `gap-6` | 카드 내부 패딩 |
| xl | 32px | `p-8`, `gap-8` | 섹션 간 간격 |
| 2xl | 48px | `p-12`, `gap-12` | 큰 섹션 구분 |

### Layout Spacing
- 페이지 좌우 패딩: `px-4` (모바일), `px-6` (태블릿+)
- 섹션 간 간격: `py-8` ~ `py-12`
- 카드 내부 패딩: `p-5` ~ `p-6`

---

## Component Styles (컴포넌트 스타일)

### Buttons

**Primary Button**
```tsx
<button className="
  w-full py-4 px-6
  bg-[#191F28] text-white
  text-base font-semibold
  rounded-xl
  active:scale-[0.98]
  transition-transform duration-150
  disabled:bg-[#E5E8EB] disabled:text-[#B0B8C1]
">
  버튼 텍스트
</button>
```

**Secondary Button**
```tsx
<button className="
  w-full py-4 px-6
  bg-[#F3F4F6] text-[#191F28]
  text-base font-semibold
  rounded-xl
  active:scale-[0.98]
  transition-transform duration-150
">
  버튼 텍스트
</button>
```

**Text Button**
```tsx
<button className="
  text-[#3182F6] font-medium
  active:opacity-70
  transition-opacity
">
  텍스트 버튼
</button>
```

### Cards

**Basic Card**
```tsx
<div className="
  bg-white
  rounded-2xl
  p-5
  border border-[#F2F4F6]
">
  {/* 카드 내용 */}
</div>
```

**Elevated Card** (그림자 사용 시)
```tsx
<div className="
  bg-white
  rounded-2xl
  p-5
  shadow-[0_2px_8px_rgba(0,0,0,0.04)]
">
  {/* 카드 내용 */}
</div>
```

### Input Fields

**Default Input**
```tsx
<input className="
  w-full py-4 px-4
  bg-[#F9FAFB]
  text-[#191F28]
  placeholder:text-[#B0B8C1]
  rounded-xl
  border-0
  outline-none
  focus:ring-2 focus:ring-[#3182F6]/20
  transition-shadow
"/>
```

### List Items

**Basic List Item**
```tsx
<div className="
  flex items-center justify-between
  py-4
  border-b border-[#F2F4F6]
  last:border-b-0
">
  <span className="text-[#191F28]">항목</span>
  <span className="text-[#8B95A1]">값</span>
</div>
```

### Chips/Tags

```tsx
<span className="
  inline-flex items-center
  px-3 py-1.5
  bg-[#F3F4F6]
  text-[#4E5968] text-sm font-medium
  rounded-full
">
  태그
</span>
```

---

## Border Radius (모서리 반경)

| Token | Value | Tailwind | 용도 |
|-------|-------|----------|------|
| sm | 8px | `rounded-lg` | 작은 버튼, 태그 |
| md | 12px | `rounded-xl` | 인풋, 일반 버튼 |
| lg | 16px | `rounded-2xl` | 카드, 모달 |
| full | 9999px | `rounded-full` | 칩, 아바타 |

---

## Shadows (그림자)

그림자는 최소한으로 사용. 필요시 매우 subtle하게.

```css
/* 기본 그림자 - 카드 호버 등 */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);

/* 팝업/모달용 */
shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);

/* 바텀시트용 */
shadow-up: 0 -4px 16px rgba(0, 0, 0, 0.08);
```

---

## Interactions (인터랙션)

### Transitions
```css
/* 기본 트랜지션 */
transition-all duration-200 ease-out

/* 버튼 프레스 효과 */
active:scale-[0.98] transition-transform duration-150

/* 호버 효과 (데스크탑) */
hover:bg-[#F9FAFB] transition-colors
```

### Touch Feedback
- 모든 터치 가능 요소: `active:scale-[0.98]` 또는 `active:opacity-80`
- 터치 타겟 최소 크기: 44x44px

### Loading States
```tsx
/* 스켈레톤 */
<div className="
  animate-pulse
  bg-[#F3F4F6]
  rounded-lg
  h-4 w-32
"/>

/* 스피너 */
<div className="
  w-5 h-5
  border-2 border-[#E5E8EB]
  border-t-[#3182F6]
  rounded-full
  animate-spin
"/>
```

---

## Layout Patterns (레이아웃 패턴)

### Page Structure
```tsx
<main className="min-h-screen bg-white">
  {/* 헤더 */}
  <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10">
    <div className="px-4 py-3 flex items-center justify-between">
      {/* 헤더 내용 */}
    </div>
  </header>

  {/* 콘텐츠 */}
  <div className="px-4 py-6">
    {/* 페이지 내용 */}
  </div>

  {/* 하단 고정 버튼 (선택) */}
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F2F4F6]">
    <button>액션</button>
  </div>
</main>
```

### Section Divider
섹션 구분은 배경색 변화로:
```tsx
<section className="bg-[#F9FAFB] py-3" />
```

또는 여백으로:
```tsx
<div className="h-8" /> {/* 섹션 간 여백 */}
```

---

## Icons (아이콘)

### Style Guide
- 아이콘 라이브러리: Lucide React
- 기본 크기: 24x24px (`w-6 h-6`)
- 작은 아이콘: 20x20px (`w-5 h-5`)
- 선 두께: 1.5px ~ 2px (Lucide 기본값)
- 색상: 텍스트 색상과 동일하게 사용

```tsx
import { ChevronRight, Check, X } from 'lucide-react';

<ChevronRight className="w-5 h-5 text-[#8B95A1]" />
```

---

## Accessibility (접근성)

### Color Contrast
- 일반 텍스트: 최소 4.5:1 대비율
- 큰 텍스트(18px+): 최소 3:1 대비율
- `#191F28` on `#FFFFFF`: 15.5:1 (Pass)
- `#8B95A1` on `#FFFFFF`: 4.6:1 (Pass)

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:ring-offset-2
```

### Touch Targets
- 최소 44x44px 확보
- 인접 요소 간 최소 8px 간격

---

## Anti-Patterns (하지 말아야 할 것)

### ❌ 금지 사항
1. **그라데이션 사용** - 모든 배경, 텍스트, 버튼에서 금지
2. **과도한 그림자** - 여러 겹의 그림자, 진한 그림자
3. **복잡한 보더** - 두꺼운 테두리, 여러 색상 테두리
4. **화려한 애니메이션** - 바운스, 스프링 등 과한 효과
5. **진한 색상 남용** - 원색 배경, 네온 컬러
6. **좁은 여백** - 요소 간 간격 부족
7. **작은 터치 타겟** - 44px 미만의 버튼/링크

### ✅ 권장 사항
1. 충분한 여백 사용
2. 명확한 시각적 계층 구조
3. 일관된 컴포넌트 스타일
4. 부드럽고 빠른 트랜지션
5. 정보 그룹핑을 위한 카드 사용
6. 단색 배경으로 영역 구분

---

## Example: Complete Card Component

```tsx
'use client';

import { ChevronRight } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function InfoCard({ title, description, onClick }: InfoCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-white
        rounded-2xl
        p-5
        border border-[#F2F4F6]
        text-left
        active:scale-[0.98]
        transition-transform duration-150
      "
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[#191F28] font-semibold">
            {title}
          </h3>
          <p className="text-sm text-[#8B95A1]">
            {description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#B0B8C1] flex-shrink-0" />
      </div>
    </button>
  );
}
```

---

## Quick Reference (빠른 참조)

### 자주 쓰는 Tailwind 조합

```tsx
// 페이지 배경
"min-h-screen bg-white"

// 카드
"bg-white rounded-2xl p-5 border border-[#F2F4F6]"

// 제목
"text-xl font-semibold text-[#191F28]"

// 본문
"text-base text-[#4E5968]"

// 보조 텍스트
"text-sm text-[#8B95A1]"

// 메인 버튼
"w-full py-4 bg-[#191F28] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"

// 인풋
"w-full py-4 px-4 bg-[#F9FAFB] rounded-xl outline-none focus:ring-2 focus:ring-[#3182F6]/20"

// 구분선
"border-b border-[#F2F4F6]"

// 섹션 간격
"space-y-6" 또는 "py-8"
```
