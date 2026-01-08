# Design System Specification

## Overview

"연정" 서비스의 디자인 시스템 스펙입니다.
일관된 UI/UX를 위한 컴포넌트 라이브러리, 디자인 토큰, 패턴을 정의합니다.

---

## UI Stack

| Layer | Technology | 용도 |
|-------|------------|------|
| **Styling** | Tailwind CSS v4 | 유틸리티 기반 스타일링 |
| **Components** | shadcn/ui | 재사용 가능한 UI 컴포넌트 |
| **Primitives** | Radix UI | 접근성 높은 헤드리스 컴포넌트 |
| **Animation** | Framer Motion | 선언적 애니메이션 |
| **Icons** | Lucide React | 오픈소스 아이콘 라이브러리 |

### 설치된 shadcn/ui 컴포넌트
- `button` - 버튼
- `dialog` - 모달/다이얼로그
- `dropdown-menu` - 드롭다운 메뉴
- `input` - 입력 필드
- `select` - 셀렉트 박스
- `tabs` - 탭
- `sonner` - 토스트 알림

### 컴포넌트 추가 방법
```bash
npx shadcn@latest add [component-name]
```

---

## 1. Design Tokens

### 1.1. Colors

#### Brand Colors (White + Pastel Theme)
```css
:root {
  /* Primary - Coral */
  --color-primary-400: #FFA08C;
  --color-primary-500: #FF8E76;  /* Main */
  --color-primary-600: #E67A64;
  
  /* Secondary - Rose */
  --color-secondary: #FFF0F3;    /* Rose Light */
  --color-rose-soft: #F5C6CB;
  --color-rose-light: #FFF0F3;
  
  /* Accent - Sage */
  --color-accent: #E8F4EF;       /* Sage Light */
  --color-sage-green: #B8D4C8;
  --color-sage-light: #E8F4EF;
  
  /* Background */
  --color-cream-bg: #FDF8F3;
  --color-cream-dark: #F5EDE5;
  --color-peach-light: #FFF5F0;
  --color-peach-soft: #FFEFE5;
}
```

#### Semantic Colors
```css
:root {
  /* Background */
  --background: #FFFFFF;
  --muted: #FDF8F3;           /* Cream */
  
  /* Text */
  --foreground: #3D3632;      /* Brown 900 - Primary text */
  --muted-foreground: #7A716A; /* Brown 500 - Secondary text */
  --color-brown-900: #3D3632;
  --color-brown-700: #5C544E;
  --color-brown-500: #7A716A;
  
  /* Gray Scale */
  --color-gray-600: #6B7280;
  --color-gray-400: #9CA3AF;
  --color-gray-200: #E5E7EB;
  --color-gray-100: #F3F4F6;
  
  /* Border */
  --border: #F5EDE5;
  --input: #F5EDE5;
  
  /* Status */
  --destructive: #EF4444;
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-info: #2196F3;
}
```

### 1.2. Typography

#### Font Families
```css
:root {
  --font-display: 'Nanum Myeongjo', ui-serif, Georgia, serif;
  --font-serif: 'Playfair Display', ui-serif, Georgia, serif;
  --font-sans: 'Noto Sans KR', ui-sans-serif, system-ui, sans-serif;
}
```

> **Note**: Next.js `next/font/google`로 로딩되며, CSS 변수로 적용됩니다.

#### Font Sizes
```css
:root {
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
}
```

#### Font Weights
```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### Line Heights
```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### 1.3. Spacing

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
}
```

### 1.4. Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
}
```

### 1.5. Shadows

```css
/* Utility Classes in globals.css */

.shadow-dreamy {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 25px -5px rgba(255, 142, 118, 0.1),
    0 20px 50px -12px rgba(245, 198, 203, 0.15);
}

.shadow-romantic {
  box-shadow: 
    0 25px 50px -12px rgba(255, 142, 118, 0.15),
    0 0 0 1px rgba(255, 142, 118, 0.05);
}

/* Glow Effects */
.glow-coral {
  box-shadow: 
    0 0 20px rgba(255, 142, 118, 0.3),
    0 0 40px rgba(255, 142, 118, 0.15),
    0 0 60px rgba(255, 142, 118, 0.05);
}

.glow-coral-sm {
  box-shadow: 0 0 15px rgba(255, 142, 118, 0.25);
}

.glow-rose {
  box-shadow: 0 0 30px rgba(245, 198, 203, 0.4);
}
```

### 1.6. Z-Index

```css
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
  --z-toast: 80;
}
```

### 1.7. Transitions & Easing

```css
:root {
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 1.8. Animation Classes

```css
/* globals.css에 정의된 애니메이션 */
.animate-fade-up      /* 아래에서 위로 페이드 인 */
.animate-fade-in      /* 페이드 인 */
.animate-float        /* 둥둥 떠다니는 효과 */
.animate-float-slow   /* 느린 플로팅 */
.animate-drift        /* 드리프트 효과 */
.animate-petal        /* 꽃잎 떨어지는 효과 */
.animate-sparkle      /* 반짝이는 효과 */
.animate-pulse-glow   /* 글로우 펄스 */
.animate-shimmer      /* 쉬머 효과 */
.animate-gradient     /* 그라데이션 이동 */
.animate-bounce-soft  /* 부드러운 바운스 */
.animate-wiggle       /* 흔들림 */
.animate-scale-pulse  /* 스케일 펄스 */

/* Animation Delays */
.delay-100 ~ .delay-1000
```

---

## 2. Component Library

### 2.1. Button

#### Variants

| Variant | Usage | Style |
|---------|-------|-------|
| `primary` | 주요 액션 | Coral gradient, white text |
| `secondary` | 보조 액션 | White bg, coral border |
| `ghost` | 텍스트 액션 | Transparent, coral text |
| `danger` | 위험 액션 | Red bg |
| `outline` | 외곽선만 | Transparent, border |

#### Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | 12px 16px | 14px |
| `md` | 40px | 12px 20px | 16px |
| `lg` | 48px | 16px 24px | 18px |
| `xl` | 56px | 20px 32px | 18px |

#### States

```tsx
// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

#### Styles

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500));
  color: white;
  box-shadow: var(--shadow-romantic);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-romantic-lg);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### 2.2. Input

#### Types

| Type | Usage |
|------|-------|
| `text` | 일반 텍스트 입력 |
| `email` | 이메일 입력 |
| `password` | 비밀번호 입력 |
| `tel` | 전화번호 입력 |
| `number` | 숫자 입력 |
| `textarea` | 여러 줄 입력 |
| `search` | 검색 입력 |

#### States

| State | Style |
|-------|-------|
| Default | Gray border |
| Focus | Primary border + glow |
| Error | Red border |
| Disabled | Gray bg, reduced opacity |
| Success | Green border + checkmark |

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 2.3. Select

```tsx
interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}
```

### 2.4. Checkbox & Radio

```tsx
interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
}

interface RadioGroupProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}
```

### 2.5. Card

#### Variants

| Variant | Usage | Style |
|---------|-------|-------|
| `default` | 기본 카드 | White bg, shadow |
| `elevated` | 강조 카드 | Larger shadow |
| `outline` | 테두리 카드 | Border, no shadow |
| `glass` | 글래스 카드 | Blur backdrop |

```tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
}
```

### 2.6. Modal / Dialog

```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}
```

#### Sizes

| Size | Width |
|------|-------|
| `sm` | 400px |
| `md` | 500px |
| `lg` | 640px |
| `xl` | 800px |
| `full` | 100% - 32px |

### 2.7. Toast / Notification

```tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;  // default 3000ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### Toast Positions

```tsx
type ToastPosition = 
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';
```

### 2.8. Tabs

```tsx
interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}
```

### 2.9. Accordion

```tsx
interface AccordionProps {
  items: { 
    id: string; 
    title: string; 
    content: React.ReactNode;
    icon?: React.ReactNode;
  }[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}
```

### 2.10. Badge

```tsx
interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  dot?: boolean;  // 텍스트 없이 점만
}
```

---

## 3. Form Patterns

### 3.1. Form Layout

```tsx
// 기본 폼 레이아웃
<form>
  <FormGroup>
    <Label htmlFor="email" required>이메일</Label>
    <Input id="email" type="email" placeholder="email@example.com" />
    <HelperText>로그인에 사용할 이메일입니다</HelperText>
  </FormGroup>
  
  <FormGroup error>
    <Label htmlFor="name">이름</Label>
    <Input id="name" error />
    <ErrorText>이름을 입력해주세요</ErrorText>
  </FormGroup>
</form>
```

### 3.2. Form Validation

| Timing | Strategy |
|--------|----------|
| On Submit | 전체 폼 유효성 검사 |
| On Blur | 필드 벗어날 때 검사 |
| On Change | 입력 중 실시간 검사 (비밀번호 등) |

### 3.3. Error Messages

| Type | Format |
|------|--------|
| Required | `{필드명}을(를) 입력해주세요` |
| Format | `올바른 {형식}을(를) 입력해주세요` |
| Min Length | `최소 {n}자 이상 입력해주세요` |
| Max Length | `최대 {n}자까지 입력할 수 있어요` |

---

## 4. Loading Patterns

### 4.1. Spinner

```tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}

// Sizes
// sm: 16px
// md: 24px
// lg: 32px
```

### 4.2. Skeleton

```tsx
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}
```

### 4.3. Loading States

| Component | Loading Pattern |
|-----------|-----------------|
| Button | Spinner + disabled |
| Card | Skeleton |
| Image | Blur placeholder → fade in |
| Table | Row skeletons |
| Page | Full page skeleton |

---

## 5. Empty States

### 5.1. Pattern

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 5.2. Examples

| Context | Icon | Title | Action |
|---------|------|-------|--------|
| 청첩장 없음 | 💌 | "아직 청첩장이 없어요" | "+ 청첩장 만들기" |
| 갤러리 빔 | 📷 | "사진을 추가해주세요" | "+ 사진 추가" |
| RSVP 없음 | ✉️ | "아직 응답이 없어요" | - |
| 검색 결과 없음 | 🔍 | "검색 결과가 없어요" | "검색어 수정" |

---

## 6. Animation Patterns

### 6.1. Entrance Animations

```tsx
// Framer Motion variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};
```

### 6.2. Stagger Children

```tsx
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
```

### 6.3. Hover Effects

| Element | Effect |
|---------|--------|
| Card | Scale 1.02 + shadow increase |
| Button | Y -2px + glow |
| Link | Underline animation |
| Image | Scale 1.05 (within container) |

### 6.4. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Responsive Patterns

### 7.1. Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 7.2. Container

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### 7.3. Grid System

```tsx
// 반응형 그리드
<Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
  <GridItem>{/* ... */}</GridItem>
</Grid>
```

---

## 8. Accessibility

### 8.1. Color Contrast

| Element | Ratio | Standard |
|---------|-------|----------|
| Body Text | 7:1+ | WCAG AAA |
| Large Text | 4.5:1+ | WCAG AA |
| Interactive | 3:1+ | WCAG AA |

### 8.2. Focus States

```css
/* Focus visible for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 8.3. Touch Targets

- 최소 크기: 44x44px
- 간격: 최소 8px

### 8.4. Screen Reader

```tsx
// 스크린 리더 전용 텍스트
<span className="sr-only">숨겨진 텍스트</span>

// ARIA labels
<button aria-label="메뉴 열기">☰</button>

// Live regions
<div aria-live="polite">{notification}</div>
```

---

## 9. Icon System

### 9.1. Icon Library

- **Primary**: Lucide Icons (React)
- **Custom**: SVG icons for brand-specific

### 9.2. Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Inline with small text |
| `sm` | 16px | Inline with body text |
| `md` | 20px | Buttons, inputs |
| `lg` | 24px | Navigation, cards |
| `xl` | 32px | Empty states |
| `2xl` | 48px | Hero sections |

### 9.3. Icon Colors

```tsx
<Icon 
  name="heart" 
  size="md" 
  className="text-primary-500"  // Tailwind color class
/>
```

---

## 10. File Structure

```
components/
├── ui/                    # shadcn/ui + Radix 기반 컴포넌트
│   ├── button.tsx         # shadcn/ui
│   ├── dialog.tsx         # shadcn/ui + Radix
│   ├── dropdown-menu.tsx  # shadcn/ui + Radix
│   ├── input.tsx          # shadcn/ui
│   ├── select.tsx         # shadcn/ui + Radix
│   ├── tabs.tsx           # shadcn/ui + Radix
│   ├── sonner.tsx         # shadcn/ui (Toast)
│   └── SmoothScroll.tsx   # Custom
│
├── forms/                 # Form-related components
│   ├── FormGroup.tsx
│   ├── Label.tsx
│   ├── HelperText.tsx
│   ├── ErrorText.tsx
│   └── FormField.tsx
│
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
│
├── home/                  # Landing page components
│   ├── HeroSection.tsx
│   ├── CTASection.tsx
│   └── ...
│
├── features/              # Feature-specific components
│   └── ...
│
└── patterns/              # Composite patterns
    ├── EmptyState.tsx
    ├── LoadingOverlay.tsx
    └── ConfirmDialog.tsx
```

---

## 11. Tailwind CSS v4 Configuration

Tailwind CSS v4는 CSS 기반 설정을 사용합니다. `globals.css`의 `@theme` 블록에서 커스텀 토큰을 정의합니다.

```css
/* globals.css */
@theme {
  --font-display: var(--font-nanum-myeongjo), ui-serif, Georgia, serif;
  --font-serif: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-noto-sans), ui-sans-serif, system-ui, sans-serif;

  --color-cream-bg: #FDF8F3;
  --color-coral-400: #FFA08C;
  --color-coral-500: #FF8E76;
  --color-coral-600: #E67A64;
  --color-rose-soft: #F5C6CB;
  --color-sage-green: #B8D4C8;
  --color-brown-900: #3D3632;
  /* ... */

  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### shadcn/ui 테마 변수

`:root`에서 shadcn/ui 호환 CSS 변수를 정의합니다:

```css
:root {
  --background: #FFFFFF;
  --foreground: #3D3632;
  --primary: #FF8E76;
  --primary-foreground: #FFFFFF;
  --secondary: #FFF0F3;
  --muted: #FDF8F3;
  --accent: #E8F4EF;
  --destructive: #EF4444;
  --border: #F5EDE5;
  --ring: #FF8E76;
}
```
