# Theme System Specification

## Overview

"연정" 서비스의 청첩장 테마 시스템 스펙입니다.
5가지 기본 테마와 사용자 커스터마이징 옵션을 정의합니다.

---

## 1. Theme Architecture

### 1.1. 구조

```
Theme
├── id: string                    # 고유 식별자
├── name: string                  # 표시 이름
├── description: string           # 설명
├── thumbnail: string             # 썸네일 이미지 URL
├── category: ThemeCategory       # 카테고리
├── colors: ThemeColors           # 색상 팔레트
├── typography: ThemeTypography   # 타이포그래피
├── layout: ThemeLayout           # 레이아웃 설정
├── effects: ThemeEffects         # 애니메이션/효과
└── assets: ThemeAssets           # 장식 요소
```

### 1.2. TypeScript Interface

```typescript
interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  thumbnail: string;
  category: 'romantic' | 'classic' | 'modern' | 'nature' | 'seasonal';
  
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient?: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  
  typography: {
    displayFont: string;
    bodyFont: string;
    fontScale: number;  // 1.0 = 기본
  };
  
  layout: {
    heroStyle: 'full-image' | 'split' | 'overlay' | 'minimal';
    sectionSpacing: 'compact' | 'normal' | 'spacious';
    cardStyle: 'flat' | 'elevated' | 'glass' | 'bordered';
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  };
  
  effects: {
    scrollAnimation: boolean;
    parallax: boolean;
    floatingElements: boolean;
    backgroundAnimation: boolean;
  };
  
  assets: {
    decorations: string[];     // 장식 SVG/이미지 URL
    dividers: string[];        // 섹션 구분선
    patterns: string[];        // 배경 패턴
    icons: 'outlined' | 'filled' | 'duotone';
  };
}
```

---

## 2. Default Themes

### 2.1. Romantic Pink (로맨틱 핑크) - 기본값

```typescript
const romanticPink: Theme = {
  id: 'romantic-pink',
  name: '로맨틱 핑크',
  nameEn: 'Romantic Pink',
  description: '따뜻하고 사랑스러운 핑크톤의 로맨틱 테마',
  thumbnail: '/themes/romantic-pink.jpg',
  category: 'romantic',
  
  colors: {
    primary: '#FF7A5C',      // Coral
    secondary: '#FFB6C1',    // Rose soft
    accent: '#A8C5A8',       // Sage
    background: '#FDF8F3',   // Cream
    backgroundGradient: 'linear-gradient(180deg, #FDF8F3 0%, #FFE4D6 50%, #FFE4E9 100%)',
    text: '#5D4E4E',         // Brown
    textSecondary: '#8B7E7E',
    border: '#F0E8E4',
  },
  
  typography: {
    displayFont: 'Nanum Myeongjo',
    bodyFont: 'Noto Sans KR',
    fontScale: 1.0,
  },
  
  layout: {
    heroStyle: 'full-image',
    sectionSpacing: 'normal',
    cardStyle: 'elevated',
    borderRadius: 'large',
  },
  
  effects: {
    scrollAnimation: true,
    parallax: true,
    floatingElements: true,    // 꽃잎 애니메이션
    backgroundAnimation: true, // 그라데이션 blob
  },
  
  assets: {
    decorations: ['/assets/petal-pink.svg', '/assets/heart-outline.svg'],
    dividers: ['/assets/divider-floral.svg'],
    patterns: ['/assets/pattern-dots.svg'],
    icons: 'outlined',
  },
};
```

### 2.2. Classic Ivory (클래식 아이보리)

```typescript
const classicIvory: Theme = {
  id: 'classic-ivory',
  name: '클래식 아이보리',
  nameEn: 'Classic Ivory',
  description: '우아하고 격조 있는 클래식 테마',
  thumbnail: '/themes/classic-ivory.jpg',
  category: 'classic',
  
  colors: {
    primary: '#B8860B',      // Dark Goldenrod
    secondary: '#D4AF37',    // Gold
    accent: '#8B4513',       // Saddle Brown
    background: '#FFFEF5',   // Ivory
    backgroundGradient: 'linear-gradient(180deg, #FFFEF5 0%, #FFF8E7 100%)',
    text: '#3D3D3D',
    textSecondary: '#6B6B6B',
    border: '#E8E0D0',
  },
  
  typography: {
    displayFont: 'Playfair Display',
    bodyFont: 'Noto Sans KR',
    fontScale: 1.05,
  },
  
  layout: {
    heroStyle: 'overlay',
    sectionSpacing: 'spacious',
    cardStyle: 'bordered',
    borderRadius: 'small',
  },
  
  effects: {
    scrollAnimation: true,
    parallax: false,
    floatingElements: false,
    backgroundAnimation: false,
  },
  
  assets: {
    decorations: ['/assets/ornament-gold.svg'],
    dividers: ['/assets/divider-classic.svg'],
    patterns: ['/assets/pattern-damask.svg'],
    icons: 'filled',
  },
};
```

### 2.3. Modern Gray (모던 그레이)

```typescript
const modernGray: Theme = {
  id: 'modern-gray',
  name: '모던 그레이',
  nameEn: 'Modern Gray',
  description: '세련되고 미니멀한 모던 테마',
  thumbnail: '/themes/modern-gray.jpg',
  category: 'modern',
  
  colors: {
    primary: '#2D2D2D',      // Charcoal
    secondary: '#6B6B6B',    // Gray
    accent: '#E8E8E8',       // Light Gray
    background: '#FFFFFF',
    backgroundGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    border: '#E0E0E0',
  },
  
  typography: {
    displayFont: 'Noto Sans KR',
    bodyFont: 'Noto Sans KR',
    fontScale: 0.95,
  },
  
  layout: {
    heroStyle: 'minimal',
    sectionSpacing: 'compact',
    cardStyle: 'flat',
    borderRadius: 'none',
  },
  
  effects: {
    scrollAnimation: true,
    parallax: false,
    floatingElements: false,
    backgroundAnimation: false,
  },
  
  assets: {
    decorations: [],
    dividers: ['/assets/divider-line.svg'],
    patterns: [],
    icons: 'outlined',
  },
};
```

### 2.4. Garden Green (가든 그린)

```typescript
const gardenGreen: Theme = {
  id: 'garden-green',
  name: '가든 그린',
  nameEn: 'Garden Green',
  description: '자연의 싱그러움을 담은 보태니컬 테마',
  thumbnail: '/themes/garden-green.jpg',
  category: 'nature',
  
  colors: {
    primary: '#4A7C59',      // Forest Green
    secondary: '#8FBC8F',    // Dark Sea Green
    accent: '#DEB887',       // Burlywood
    background: '#F5F9F5',
    backgroundGradient: 'linear-gradient(180deg, #F5F9F5 0%, #E8F0E8 100%)',
    text: '#2F4F2F',
    textSecondary: '#5F7F5F',
    border: '#D4E4D4',
  },
  
  typography: {
    displayFont: 'Nanum Myeongjo',
    bodyFont: 'Noto Sans KR',
    fontScale: 1.0,
  },
  
  layout: {
    heroStyle: 'split',
    sectionSpacing: 'normal',
    cardStyle: 'glass',
    borderRadius: 'medium',
  },
  
  effects: {
    scrollAnimation: true,
    parallax: true,
    floatingElements: true,    // 나뭇잎 애니메이션
    backgroundAnimation: false,
  },
  
  assets: {
    decorations: ['/assets/leaf-green.svg', '/assets/branch.svg'],
    dividers: ['/assets/divider-botanical.svg'],
    patterns: ['/assets/pattern-leaves.svg'],
    icons: 'duotone',
  },
};
```

### 2.5. Sunset Coral (선셋 코랄)

```typescript
const sunsetCoral: Theme = {
  id: 'sunset-coral',
  name: '선셋 코랄',
  nameEn: 'Sunset Coral',
  description: '노을처럼 따뜻하고 감성적인 테마',
  thumbnail: '/themes/sunset-coral.jpg',
  category: 'romantic',
  
  colors: {
    primary: '#E07A5F',      // Terra Cotta
    secondary: '#F2CC8F',    // Sunset Yellow
    accent: '#81B29A',       // Sage
    background: '#FFF9F5',
    backgroundGradient: 'linear-gradient(180deg, #FFF9F5 0%, #FFE8DD 50%, #F2CC8F20 100%)',
    text: '#5C4033',
    textSecondary: '#8B7355',
    border: '#F0E0D8',
  },
  
  typography: {
    displayFont: 'Nanum Myeongjo',
    bodyFont: 'Noto Sans KR',
    fontScale: 1.0,
  },
  
  layout: {
    heroStyle: 'full-image',
    sectionSpacing: 'normal',
    cardStyle: 'elevated',
    borderRadius: 'large',
  },
  
  effects: {
    scrollAnimation: true,
    parallax: true,
    floatingElements: false,
    backgroundAnimation: true,
  },
  
  assets: {
    decorations: ['/assets/sun-rays.svg'],
    dividers: ['/assets/divider-wave.svg'],
    patterns: ['/assets/pattern-sunset.svg'],
    icons: 'outlined',
  },
};
```

---

## 3. Theme Customization

### 3.1. 커스터마이징 가능 항목

| Category | Options | Level |
|----------|---------|-------|
| **Colors** | Primary, Accent | 모든 테마 |
| **Typography** | Font style (3종) | 모든 테마 |
| **Effects** | 애니메이션 ON/OFF | 모든 테마 |

### 3.2. Custom Color Picker

```typescript
interface ThemeCustomization {
  themeId: string;
  
  // 커스텀 색상
  customColors?: {
    primary?: string;    // 메인 포인트 색상
    accent?: string;     // 보조 색상
  };
  
  // 폰트 스타일
  fontStyle?: 'classic' | 'modern' | 'handwritten';
  
  // 효과 설정
  effects?: {
    scrollAnimation?: boolean;
    parallax?: boolean;
    floatingElements?: boolean;
  };
}
```

### 3.3. Font Style Options

| Style | Display Font | Body Font | Description |
|-------|--------------|-----------|-------------|
| `classic` | Nanum Myeongjo | Noto Sans KR | 전통적이고 우아한 |
| `modern` | Noto Sans KR | Noto Sans KR | 깔끔하고 현대적인 |
| `handwritten` | 나눔손글씨 | Noto Sans KR | 따뜻하고 개인적인 |

### 3.4. Color Presets

빠른 색상 선택을 위한 프리셋:

```typescript
const colorPresets = [
  { name: '코랄', primary: '#FF7A5C', accent: '#FFB6C1' },
  { name: '로즈', primary: '#E91E63', accent: '#F8BBD9' },
  { name: '버건디', primary: '#800020', accent: '#D4A5A5' },
  { name: '네이비', primary: '#1E3A5F', accent: '#A8C5D6' },
  { name: '세이지', primary: '#4A7C59', accent: '#C8D5BB' },
  { name: '라벤더', primary: '#7B68EE', accent: '#E6E6FA' },
  { name: '골드', primary: '#B8860B', accent: '#FFD700' },
  { name: '테라코타', primary: '#E07A5F', accent: '#F2CC8F' },
];
```

---

## 4. Theme Application

### 4.1. CSS Variables Generation

```typescript
function generateThemeCSS(theme: Theme, customization?: ThemeCustomization): string {
  const colors = {
    ...theme.colors,
    ...(customization?.customColors || {}),
  };
  
  return `
    :root {
      --theme-primary: ${colors.primary};
      --theme-secondary: ${colors.secondary};
      --theme-accent: ${colors.accent};
      --theme-background: ${colors.background};
      --theme-background-gradient: ${colors.backgroundGradient};
      --theme-text: ${colors.text};
      --theme-text-secondary: ${colors.textSecondary};
      --theme-border: ${colors.border};
      
      --theme-font-display: ${theme.typography.displayFont};
      --theme-font-body: ${theme.typography.bodyFont};
      --theme-font-scale: ${theme.typography.fontScale};
      
      --theme-radius: ${getRadiusValue(theme.layout.borderRadius)};
      --theme-spacing: ${getSpacingValue(theme.layout.sectionSpacing)};
    }
  `;
}
```

### 4.2. ThemeProvider

```tsx
// contexts/ThemeContext.tsx
interface ThemeContextValue {
  theme: Theme;
  customization: ThemeCustomization;
  setTheme: (themeId: string) => void;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
}

export function ThemeProvider({ 
  invitation, 
  children 
}: { 
  invitation: Invitation; 
  children: React.ReactNode;
}) {
  const theme = getThemeById(invitation.theme);
  const customization = invitation.customization;
  
  const cssVariables = generateThemeCSS(theme, customization);
  
  return (
    <ThemeContext.Provider value={{ theme, customization, ... }}>
      <style>{cssVariables}</style>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 4.3. Theme-aware Components

```tsx
// 테마 색상을 사용하는 버튼
function ThemedButton({ children, ...props }) {
  return (
    <button 
      className="bg-[var(--theme-primary)] text-white rounded-[var(--theme-radius)]"
      {...props}
    >
      {children}
    </button>
  );
}

// 테마 배경
function ThemedBackground({ children }) {
  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--theme-background-gradient)' }}
    >
      {children}
    </div>
  );
}
```

---

## 5. Hero Section Styles

### 5.1. Full Image (전체 이미지)

```
┌─────────────────────────┐
│                         │
│     [Full Width         │
│      Cover Image]       │
│                         │
│   ────────────────────  │
│      민영 ♥ 지훈         │
│    2025.05.16 Sat       │
│                         │
└─────────────────────────┘
```

- 대표 이미지가 전체 화면
- 텍스트는 이미지 위 또는 아래

### 5.2. Split (분할)

```
┌─────────────────────────┐
│  민영 ♥ 지훈  │ [Image] │
│              │         │
│ 2025.05.16   │         │
│ 더채플앳청담  │         │
└─────────────────────────┘
```

- 좌: 텍스트, 우: 이미지
- 모바일에서는 stacked

### 5.3. Overlay (오버레이)

```
┌─────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓    민영 ♥ 지훈      ▓ │
│ ▓   2025.05.16 Sat   ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  [Background Image]     │
└─────────────────────────┘
```

- 배경 이미지 + 반투명 오버레이
- 텍스트가 이미지 위에

### 5.4. Minimal (미니멀)

```
┌─────────────────────────┐
│                         │
│      민영 ♥ 지훈         │
│    2025.05.16 Sat       │
│      더채플앳청담        │
│                         │
│      [Small Image]      │
│                         │
└─────────────────────────┘
```

- 텍스트 중심
- 작은 이미지 또는 이미지 없음

---

## 6. Section Components by Theme

### 6.1. Dividers (섹션 구분선)

| Theme | Divider Style |
|-------|---------------|
| Romantic Pink | 꽃 장식 SVG |
| Classic Ivory | 클래식 오너먼트 |
| Modern Gray | 심플 라인 |
| Garden Green | 보태니컬 리프 |
| Sunset Coral | 웨이브 라인 |

### 6.2. Card Styles

```css
/* flat */
.card-flat {
  background: white;
  border: 1px solid var(--theme-border);
}

/* elevated */
.card-elevated {
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

/* glass */
.card-glass {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.5);
}

/* bordered */
.card-bordered {
  background: white;
  border: 2px solid var(--theme-primary);
}
```

---

## 7. Floating Elements

### 7.1. Animation Types

| Theme | Element | Animation |
|-------|---------|-----------|
| Romantic Pink | 꽃잎 | 떨어지는 애니메이션 |
| Romantic Pink | 하트 | 떠오르는 애니메이션 |
| Garden Green | 나뭇잎 | 흔들리는 애니메이션 |
| Sunset Coral | 반짝임 | 깜빡이는 애니메이션 |

### 7.2. Performance Settings

```typescript
const floatingElementsConfig = {
  // 개수 제한
  maxElements: 15,
  
  // 뷰포트 밖 비활성화
  pauseWhenHidden: true,
  
  // 저사양 기기 감지
  reducedMotion: typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // 인앱 브라우저 최적화
  inAppOptimization: true,  // 개수 절반으로
};
```

---

## 8. Theme Preview

### 8.1. Preview Component

```tsx
interface ThemePreviewProps {
  theme: Theme;
  customization?: ThemeCustomization;
  sampleData: {
    groomName: string;
    brideName: string;
    date: string;
    venue: string;
    coverImage: string;
  };
}

function ThemePreview({ theme, customization, sampleData }: ThemePreviewProps) {
  return (
    <div className="phone-mockup">
      <ThemeProvider theme={theme} customization={customization}>
        <HeroSection data={sampleData} />
        <InvitationSection />
        <GallerySection />
        {/* ... */}
      </ThemeProvider>
    </div>
  );
}
```

### 8.2. Theme Selector UI

```
┌─────────────────────────────────────────────────────────────┐
│  테마 선택                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ ✓       │ │         │ │         │ │         │ │         ││
│  │ [thumb] │ │ [thumb] │ │ [thumb] │ │ [thumb] │ │ [thumb] ││
│  │         │ │         │ │         │ │         │ │         ││
│  │로맨틱핑크│ │클래식    │ │ 모던    │ │ 가든    │ │ 선셋   ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🎨 색상 커스터마이징                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 메인 색상: [● 코랄] [○] [○] [○] [○] [+ 직접 선택]     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Database Schema

```prisma
// 청첩장 테마 관련 필드
model Invitation {
  // ... 기존 필드
  
  theme         String   @default("romantic-pink")
  
  // 커스터마이징 JSON
  customization Json?
  // {
  //   customColors: { primary?: string, accent?: string },
  //   fontStyle: 'classic' | 'modern' | 'handwritten',
  //   effects: { scrollAnimation, parallax, floatingElements }
  // }
}
```

---

## 10. Theme API

### 10.1. Get Available Themes

```typescript
// GET /api/themes
{
  "data": [
    {
      "id": "romantic-pink",
      "name": "로맨틱 핑크",
      "thumbnail": "https://...",
      "category": "romantic",
      "isNew": false,
      "isPremium": false
    },
    // ...
  ]
}
```

### 10.2. Get Theme Details

```typescript
// GET /api/themes/:id
{
  "data": {
    "id": "romantic-pink",
    "name": "로맨틱 핑크",
    // ... full theme object
  }
}
```

---

## 11. Future Themes (확장)

### 11.1. 시즌 테마

| Season | Theme Name | Availability |
|--------|------------|--------------|
| 봄 | 벚꽃 블러썸 | 3월-5월 |
| 여름 | 썸머 블루 | 6월-8월 |
| 가을 | 어텀 리프 | 9월-11월 |
| 겨울 | 윈터 화이트 | 12월-2월 |

### 11.2. 프리미엄 테마 (차후)

- 디자이너 콜라보레이션
- 특별 애니메이션
- 추가 커스터마이징 옵션
