# 연정 개발 진행 현황

## Phase 1: MVP Core ✅ (완료)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 02-landing-page.md | ✅ 완료 | `app/page.tsx`, `components/home/*`, `components/landing/*` | Hero, Features, Preview, Testimonials, CTA, Footer |
| 03-authentication.md | ✅ 완료 | `lib/auth.ts`, `lib/supabase/*`, `middleware.ts`, `app/login/*`, `app/auth/callback/*` | 카카오/네이버 OAuth, 세션 관리 |
| 07-database-schema.md | ✅ 완료 | `prisma/schema.prisma`, `lib/db.ts` | User, Invitation, RSVP, Guestbook, Gallery, Coupon, Analytics |
| 04-editor-ux-flow.md | ✅ 완료 | `app/editor/new/*`, `app/editor/[id]/*` | Quick Setup, Detail Editor, 실시간 미리보기 |
| 01-mobile-invitation-core.md | ✅ 완료 | `app/i/[slug]/*` | Hero, Invitation, Gallery, Location, RSVP, Guestbook, Footer |
| 06-api-design.md | ✅ 부분 완료 | `app/api/invitations/*` | 청첩장 CRUD API |

### Phase 1 구현 상세

#### Landing Page
- [x] Header (스크롤 반응, 모바일 메뉴)
- [x] Hero Section (애니메이션, 폰 목업)
- [x] Features Section (벤토 그리드)
- [x] Preview Section (테마 선택 데모)
- [x] Testimonials Section
- [x] CTA Section
- [x] Footer (뉴스레터, 소셜 링크)

#### Authentication
- [x] Supabase Auth 연동
- [x] 카카오 OAuth
- [x] 네이버 OAuth
- [x] 미들웨어 (보호된 라우트)
- [x] 로그인/로그아웃 UI

#### Editor
- [x] Quick Setup (3가지 필수 정보)
- [x] Detail Editor (섹션별 편집)
- [x] 기본정보 섹션
- [x] 디자인 섹션 (테마 선택)
- [x] 초대글 섹션
- [x] 갤러리 섹션 (R2 업로드 연동)
- [x] 설정 섹션 (RSVP, 방명록 토글)
- [x] 계좌 섹션 (UI만)
- [x] 실시간 미리보기

#### Invitation Viewer
- [x] Hero (커버 이미지, D-Day)
- [x] Invitation (초대글, 혼주 정보)
- [x] Gallery (라이트박스)
- [x] Location (지도 링크)
- [x] RSVP 폼
- [x] Guestbook
- [x] Footer (공유 버튼)
- [x] SEO 메타데이터

#### API
- [x] POST /api/invitations (생성)
- [x] GET /api/invitations (목록)
- [x] GET /api/invitations/[id] (상세)
- [x] PATCH /api/invitations/[id] (수정)
- [x] DELETE /api/invitations/[id] (삭제)

---

## Phase 2: 필수 기능 (진행 중)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 24-image-upload-pipeline.md | ✅ 완료 | `lib/r2/*`, `lib/upload/*`, `app/api/upload/*` | Cloudflare R2 연동, Presigned URL |
| 25-map-integration.md | ⏳ 대기 | - | 카카오맵 API |
| 01-mobile-invitation-core.md | ⏳ 대기 | - | Gallery 실제 이미지, Guestbook DB 연동 |

### Phase 2 구현 상세

#### Image Upload Pipeline (24-image-upload-pipeline.md)
- [x] R2 클라이언트 설정 (`lib/r2/client.ts`)
- [x] Presigned URL 발급 API (`app/api/upload/presign/route.ts`)
- [x] 업로드 완료 처리 API (`app/api/upload/complete/route.ts`)
- [x] 클라이언트 업로드 유틸리티 (`lib/upload/utils.ts`)
  - 파일 검증 (타입, 크기)
  - 클라이언트 리사이징 (최대 2400px)
  - 업로드 진행률 표시
  - 병렬 업로드 (3개 동시)
- [x] 에디터 갤러리 섹션 업데이트
  - 드래그 앤 드롭 UI
  - 업로드 진행률 표시
  - 이미지 그리드 표시
  - 대표 사진 설정
  - 이미지 삭제

---

## Phase 3: 수익화 (대기)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 05-coupon-publishing.md | ⏳ 대기 | - | 쿠폰 발행 시스템 |
| 21-coupon-acquisition.md | ⏳ 대기 | - | 네이버 스마트스토어 연동 |
| 11-user-dashboard.md | ⏳ 대기 | - | 통계, RSVP 관리 |

---

## Phase 4: 고도화 (대기)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 23-music-bgm-system.md | ⏳ 대기 | - | 배경음악 |
| 20-ai-integration.md | ⏳ 대기 | - | AI 초대글 생성 |
| 27-horizontal-journey-theme.md | ⏳ 완료 | `app/demo/journey/*` | 데모만 완료 |
| 26-live-wedding-mode.md | ⏳ 대기 | - | 예식장 디스플레이 |
| 31-user-analytics.md | ⏳ 대기 | - | Umami 기반 방문자 분석 |

---

## 테스트 라우트

| URL | 설명 |
|-----|------|
| http://localhost:3000/ | 랜딩 페이지 |
| http://localhost:3000/login | 로그인 |
| http://localhost:3000/dashboard | 대시보드 |
| http://localhost:3000/editor/new | 새 청첩장 |
| http://localhost:3000/editor/[id] | 청첩장 편집 |
| http://localhost:3000/i/[slug] | 청첩장 공개 뷰 |
| http://localhost:3000/demo/journey | 가로 스크롤 데모 |
