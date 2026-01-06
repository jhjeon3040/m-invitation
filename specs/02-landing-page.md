# Landing Page Specification

## 1. Overview

"연정" 서비스의 마케팅 랜딩 페이지 스펙입니다.
방문자를 가입/전환으로 유도하는 것이 핵심 목표입니다.

### Design Direction: "Dreamy Romantic Editorial"
| Attribute | Description |
|-----------|-------------|
| **Mood** | 밝고 따뜻한, 꿈꾸는 듯한 로맨틱 감성 |
| **Visual** | 파스텔 톤 그라데이션, 부드러운 곡선, 풍부한 애니메이션 |
| **Layout** | 매거진/에디토리얼 스타일의 세련된 구성 |

---

## 2. Color System

### Primary Palette
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Cream | `#FDF8F3` | `--cream-bg` | 메인 배경 |
| Peach Light | `#FFE4D6` | `--peach-light` | 섹션 배경 |
| Peach Soft | `#FFDAB9` | `--peach-soft` | 그라데이션 |
| Coral 400 | `#FF8E76` | `--coral-400` | Primary 액센트 |
| Coral 500 | `#FF7A5C` | `--coral-500` | CTA 버튼 |
| Rose Light | `#FFE4E9` | `--rose-light` | 서브 액센트 |
| Rose Soft | `#FFB6C1` | `--rose-soft` | 장식 요소 |
| Sage Green | `#A8C5A8` | `--sage-green` | 포인트 컬러 |
| Brown 900 | `#5D4E4E` | `--brown-900` | 메인 텍스트 |

### Gradient Presets
```css
bg-gradient-dreamy: linear-gradient(to bottom, #FDF8F3, #FFE4D6, #FFE4E9)
bg-gradient-mesh: radial-gradient overlay pattern
text-gradient-coral: linear-gradient(135deg, #FF8E76, #FF7A5C, #FFB6C1)
```

---

## 3. Typography

| Role | Font Family | Weights | Usage |
|------|-------------|---------|-------|
| Display | Nanum Myeongjo | 400, 700 | 대제목, 브랜드명 |
| Serif | Playfair Display | 400 Italic | 부제목, 강조 문구 |
| Sans | Noto Sans KR | 400, 500, 700 | 본문, UI 요소 |

---

## 4. Animation System

### Motion Principles
- **Smooth & Dreamy**: 부드럽고 꿈꾸는 듯한 움직임
- **Delightful Details**: 미세한 인터랙션으로 즐거움 제공
- **Performance First**: transform, opacity 위주로 60fps 유지

### Decorative Animations
| Name | Description | Duration |
|------|-------------|----------|
| FloatingPetal | 꽃잎이 떨어지는 애니메이션 | 15-22s loop |
| FloatingHeart | 하트가 떠오르는 애니메이션 | 4-5s loop |
| Sparkle | 별이 반짝이는 애니메이션 | 2-3s loop |
| GradientBlob | 배경 그라데이션 blob 움직임 | 8-12s loop |

### Interaction Animations
| Trigger | Effect |
|---------|--------|
| Scroll | Parallax, Fade-in, Scale |
| Hover | Glow, Scale (1.02-1.05), Y-translate (-2 to -8px) |
| Click/Tap | Scale (0.98), Ripple |
| Page Load | Staggered entrance (0.1-0.2s delay) |

---

## 5. Page Sections

### 5.1. Header (Fixed)
| Element | Spec |
|---------|------|
| Logo | "연정." 텍스트 로고 (Nanum Myeongjo) |
| Navigation | 기능, 미리보기, 후기, 고객지원 |
| CTA Button | "시작하기" (coral gradient, rounded-full) |
| Mobile Menu | 햄버거 → 풀스크린 메뉴 |
| Style | 흰 배경 + backdrop-blur, 스크롤 시 shadow |

### 5.2. Hero Section
| Element | Spec |
|---------|------|
| Layout | 2-column (Text + Phone Mockups) on desktop, stacked on mobile |
| Badge | "프리미엄 모바일 청첩장" pill badge with pulse dot |
| Headline | "연정" (gradient text) + "사랑의 시작을 담다" (italic) |
| Subheadline | AI 초대글, 무료 체험 강조 |
| Primary CTA | "무료로 시작하기" (coral gradient + glow + shimmer) |
| Secondary CTA | "샘플 둘러보기" (white + border) |
| Trust Badges | "3분 만에 완성", "모든 기능 무료" |
| Phone Mockups | 2개 청첩장 목업 (floating animation, parallax) |
| Decorations | FloatingPetal, Sparkle, rotating dashed circles |
| Background | Gradient mesh + animated blobs |

### 5.3. Features Section (7가지 특장점)
| Element | Spec |
|---------|------|
| Layout | Bento Grid (asymmetric) |
| Section Title | "연정만의 특별함" + underline SVG animation |

#### Feature Cards
| # | Title | Description | Visual |
|---|-------|-------------|--------|
| 1 | 초개인화 | 템플릿 교체가 아닌 Design System 기반 커스터마이징 | 🎨 |
| 2 | 시네마틱 경험 | 몰입감 있는 인터랙션과 BGM 싱크 | 🎬 |
| 3 | AI 초대글 | 키워드만 입력하면 감성 문구 자동 생성 | ✨ |
| 4 | 라이브 웨딩 모드 | 예식장 스크린에 방명록 실시간 표시 | 📺 |
| 5 | 시크릿 영상 편지 | 친구들만 볼 수 있는 숨겨진 콘텐츠 (Featured, full-width) | 🤫💕 |
| 6 | 하객 인사이트 | 어떤 사진을 오래 봤는지 분석 | 📊 |
| 7 | 개인화 URL | yeonjeong.kr/우리이름 형태 고유 주소 + QR | 🔗 |

#### Card Interaction
- Hover: scale(1.02), glow effect, gradient background intensify
- Each card has unique gradient accent

### 5.4. Preview Section (테마 미리보기)
| Element | Spec |
|---------|------|
| Layout | Theme selector + Phone mockup |
| Theme Tabs | 로맨틱 핑크, 클래식 아이보리, 모던 그레이, 가든 그린 |
| Phone Mockup | 선택된 테마 실시간 반영, glow effect |
| Interaction | Tab 클릭 시 부드러운 전환 애니메이션 |
| Background | Rotating decorative circles |

### 5.5. Testimonial Section (실제 커플 후기)
| Element | Spec |
|---------|------|
| Layout | 3-column grid (desktop), carousel (mobile) |
| Section Title | "실제 커플들의 이야기" + gradient underline |

#### Testimonial Cards
| Couple | Quote Focus |
|--------|-------------|
| 민영 & 지훈 | AI 초대글 감동 |
| 수진 & 현우 | 라이브 모드 활용 |
| 유나 & 성민 | 시크릿 콘텐츠 반응 |

#### Card Design
- Glass-morphism effect (bg-white/80 backdrop-blur)
- Quote icon with gradient fill
- Profile image with glow ring
- Hover: scale, shadow-romantic

#### Mobile Carousel
- AnimatePresence for smooth transitions
- Pagination dots with glow on active

### 5.6. CTA Section (최종 전환)
| Element | Spec |
|---------|------|
| Headline | "당신의 사랑 이야기를 가장 아름답게 전하세요" |
| Subtext | "3분 만에 완성", "모든 기능 무료" 강조 |
| Primary CTA | "무료로 시작하기" (large, shimmer effect) |
| Secondary CTA | "1:1 문의하기" |
| Trust Badges | "신용카드 불필요", "3분 만에 완성", "언제든 취소 가능" |
| Social Proof | "10,000+ 커플이 연정과 함께했어요" + 별점 |
| Background | Gradient mesh + FloatingHeart animations |

### 5.7. Footer
| Element | Spec |
|---------|------|
| Logo | "연정." + tagline |
| Links | 서비스 소개, 요금제, 고객지원, FAQ |
| Legal | 이용약관, 개인정보처리방침 |
| Newsletter | 이메일 구독 폼 |
| Social | Instagram, Blog 링크 |
| Copyright | © 2025 연정. All rights reserved. |

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, carousel for testimonials |
| Tablet | 640-1024px | 2-column grids |
| Desktop | > 1024px | Full layout, all decorations visible |

### Mobile-First Considerations
- 터치 타겟 최소 44x44px
- 패딩 적절히 조절 (p-4 기본)
- 장식 요소 일부 숨김 (hidden lg:block)
- 캐러셀 대신 그리드 사용 시 스크롤 가능

---

## 7. Technical Implementation

### Framework & Libraries
| Purpose | Technology |
|---------|------------|
| Framework | Next.js 16 (App Router) |
| Animation | Framer Motion |
| Styling | Tailwind CSS v4 |
| Smooth Scroll | CSS scroll-behavior: smooth |

### Performance Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| PageSpeed (Mobile) | > 90 |

### Animation Performance
- GPU 가속 속성만 사용 (transform, opacity)
- will-change 적절히 활용
- Reduce motion 미디어 쿼리 대응
- 뷰포트 밖 애니메이션 일시정지

### Image Optimization
- Next.js Image 컴포넌트 필수
- WebP 자동 변환
- Lazy loading 적용
- Blur placeholder 사용

---

## 8. Conversion Optimization

### Primary CTA Strategy
| Location | CTA Text | Style |
|----------|----------|-------|
| Header | 시작하기 | Compact, coral |
| Hero | 무료로 시작하기 | Large, gradient + glow |
| CTA Section | 무료로 시작하기 | Extra large, shimmer |

### Trust Signals
- "3분 만에 완성" - 시간 투자 최소화
- "모든 기능 무료" - 비용 장벽 제거
- "신용카드 불필요" - 진입 장벽 제거
- "10,000+ 커플" - 사회적 증거
- 실제 커플 후기 - 신뢰도 구축

### Micro-Copy Guidelines
| Do | Don't |
|----|-------|
| 시작하기, 만들기 | 가입하기, 등록하기 |
| 무료로 체험 | 무료 평가판 |
| 커스터마이징 | 설정 변경 |
| 나만의 청첩장 | 청첩장 생성 |
