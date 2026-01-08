# Agent Handbook (m-invitation)

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Auth**: Supabase Auth (Kakao, Naver OAuth)
- **Analytics**: Umami (프라이버시 중심)
- **Linter**: ESLint

## Design System (White + Pastel Theme)
| 역할 | 색상 | CSS Variable |
|------|------|--------------|
| Primary | `#FF8E76` 코랄 | `--primary` |
| Secondary | `#FFF0F3` 로즈 | `--secondary` |
| Accent | `#E8F4EF` 세이지 | `--accent` |
| Muted | `#FDF8F3` 크림 | `--muted` |
| Background | `#FFFFFF` 화이트 | `--background` |
| Foreground | `#3D3632` 브라운 | `--foreground` |

## Clean Code Habits (MUST FOLLOW)

### 🎯 Minimal Change Principle (최소 변경 원칙)
**"요구사항을 만족하는 가장 작은 변경을 찾아라"**

코드 작성 전 필수 질문:
1. 기존에 비슷한 코드/함수/컴포넌트가 있는가? → **재사용**
2. 기존 코드를 약간 수정해서 해결 가능한가? → **확장**
3. 정말 새로 만들어야 하는가? → **최소한으로 생성**

### 📛 Naming & Clarity
- **Variables/Functions**: `camelCase` 사용 (예: `invitationId`, `getInvitation()`)
- **Components**: `PascalCase` 사용 (예: `InvitationCard.tsx`)
- **Files**:
  - App Router: `page.tsx`, `layout.tsx`, `loading.tsx` 등 Next.js 컨벤션 준수
  - Components/Utils: 파일명은 export하는 메인 대상과 일치시킴
- **Magic Numbers**: 의미 있는 상수로 추출

### 🔧 Function & Component Design
- **Single Responsibility**: 하나의 컴포넌트/함수는 한 가지 역할만 수행
- **Server Components Priority**: 가능한 서버 컴포넌트(`page.tsx`, `layout.tsx` 등)를 기본으로 사용하고, 상호작용이 필요한 경우에만 `'use client'` 지시어 사용
- **Guard Clauses**: 중첩 `if`문 대신 조기 반환(Early Return) 패턴 사용

## Responsive Design & Mobile Optimization (Critical)
**Mobile-first Principle**: 모바일 청첩장 서비스이므로 **모바일 뷰(< 640px)를 최우선으로 디자인**하고, 태블릿/데스크탑으로 확장합니다.

### Layout Guidelines
- **Touch Targets**: 모바일 터치 환경을 고려하여 버튼 및 인터랙션 요소는 충분한 크기(최소 44x44px 권장) 확보
- **Padding/Margin**:
  - Tailwind spacing 스케일 사용 (`p-4`, `m-2` 등)
  - 모바일에서는 화면 공간 활용을 위해 과도한 패딩 지양 (`p-4` 권장)
- **Grid/Flex**:
  - 기본적으로 `flex-col` 또는 `grid-cols-1` 사용
  - 더 큰 화면에서 `md:grid-cols-2`, `lg:flex-row` 등으로 확장

### Typography & Images
- **Font Size**: 모바일 가독성을 위해 본문 최소 14px~16px 유지 (`text-sm` ~ `text-base`)
- **Images**: Next.js `<Image>` 컴포넌트 필수 사용 (자동 최적화 및 Lazy Loading)

## Next.js Specific Guidelines
- **Data Fetching**: 가능한 서버 컴포넌트에서 데이터를 가져와 클라이언트 컴포넌트로 전달 (Waterfall 방지)
- **Routing**: `next/link`의 `<Link>` 컴포넌트 사용
- **Metadata**: `generateMetadata`를 활용하여 SEO 및 공유(Open Graph) 최적화

## Code Organization
- **Directory Structure**:
  - `app/`: 라우팅 및 페이지 (Next.js App Router)
  - `components/`: 재사용 가능한 UI 컴포넌트
    - `components/ui/`: 버튼, 인풋 등 기본 UI 요소 (Atomic)
    - `components/features/`: 특정 기능 관련 복합 컴포넌트
  - `lib/` or `utils/`: 유틸리티 함수 및 설정

## ⚠️ Agent Instructions (MUST FOLLOW)

### Frontend 작업 시 `/frontend-design` 스킬 사용 필수
프론트엔드 UI/UX 컴포넌트를 만들거나 수정할 때는 반드시 `/frontend-design` 스킬을 먼저 로드하세요.
```
skill(name="frontend-design")
```
이 스킬은 고품질의 디자인을 생성하는 데 특화되어 있습니다.

## ✅ Self-Review Checklist
- [ ] 모바일 화면에서 레이아웃이 깨지지 않는가?
- [ ] 불필요한 `'use client'` 선언은 없는가? (서버 컴포넌트 활용)
- [ ] 이미지에 `<Image>` 컴포넌트를 사용했는가?
- [ ] 타입 정의(`interface`/`type`)는 명확한가? (`any` 사용 금지)
