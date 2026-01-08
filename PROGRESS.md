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

## Phase 2: 필수 기능 ✅ (완료)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 24-image-upload-pipeline.md | ✅ 완료 | `lib/r2/*`, `lib/upload/*`, `app/api/upload/*` | Cloudflare R2 연동, Presigned URL |
| 25-map-integration.md | ✅ 완료 | `lib/kakao/*`, `lib/navigation.ts`, `components/map/*` | 카카오맵 SDK, 길찾기 딥링크 |
| 06-api-design.md | ✅ 완료 | `app/api/i/[slug]/rsvp/*`, `app/api/i/[slug]/guestbook/*` | RSVP/Guestbook Public API |
| 01-mobile-invitation-core.md | ✅ 완료 | `app/i/[slug]/InvitationView.tsx` | 지도 연동, RSVP/Guestbook DB 연동 |

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

#### Map Integration (25-map-integration.md)
- [x] 카카오맵 유틸리티 (`lib/kakao/map.ts`)
  - 장소 검색 (searchPlaces)
  - 주소 → 좌표 변환 (addressToCoords)
  - 좌표 → 주소 변환 (coordsToAddress)
  - 정적 지도 이미지 URL
- [x] 길찾기 딥링크 (`lib/navigation.ts`)
  - 카카오맵 앱/웹 연동
  - 네이버지도 앱/웹 연동
  - T맵 앱/웹 연동
  - 주소 복사 기능
  - 카카오 인앱 브라우저 대응
- [x] 지도 컴포넌트 (`components/map/KakaoMap.tsx`)
  - SDK 동적 로딩 (lazyOnload)
  - 마커 및 인포윈도우
  - 에러 폴백 UI
  - 접근성 지원 (aria-label)

#### Public API (06-api-design.md)
- [x] RSVP API (`app/api/i/[slug]/rsvp/route.ts`)
  - POST: 참석 여부 제출
  - 유효성 검증 (이름, side, attending 필수)
  - 청첩장 상태 확인 (PUBLISHED만 허용)
- [x] Guestbook API (`app/api/i/[slug]/guestbook/route.ts`)
  - GET: 방명록 목록 (페이지네이션)
  - POST: 방명록 작성
  - 비밀 메시지 마스킹
  - 500자 제한

#### Invitation Viewer Update
- [x] LocationSection 업데이트
  - KakaoMap 컴포넌트 연동
  - 카카오맵/네이버지도/T맵 길찾기 버튼
  - 주소 복사 (toast 피드백)
- [x] RsvpSection API 연동
  - POST /api/i/[slug]/rsvp 호출
  - 로딩/에러 상태 처리
  - 성공 시 감사 메시지
- [x] GuestbookSection API 연동
  - GET /api/i/[slug]/guestbook 호출
  - POST 후 자동 새로고침
  - 로딩 스피너, 빈 상태 UI

---

## Phase 3: 수익화 ✅ (완료)

| 스펙 | 상태 | 구현 파일 | 비고 |
|------|------|-----------|------|
| 05-coupon-publishing.md | ✅ 완료 | `app/api/coupons/*`, `app/api/invitations/[id]/publish/*`, `components/editor/PublishModal.tsx` | 쿠폰 검증, 청첩장 발행 |
| 11-user-dashboard.md | ✅ 완료 | `app/dashboard/[id]/rsvp/*`, `app/dashboard/[id]/guestbook/*`, `components/dashboard/ShareModal.tsx` | RSVP/방명록 관리, QR공유 |
| 09-seo-social-sharing.md | ✅ 완료 | `app/api/og/[slug]/*`, `app/sitemap.ts`, `app/robots.ts`, `lib/kakao/share.ts` | OG이미지, SEO, 카카오공유 |
| 21-coupon-acquisition.md | ⏳ 대기 | - | 네이버 스마트스토어 연동 |

### Phase 3 구현 상세

#### Coupon System (05-coupon-publishing.md)
- [x] 쿠폰 검증 API (`app/api/coupons/validate/route.ts`)
  - 쿠폰 코드 검증
  - 유효기간, 사용 상태 확인
- [x] 청첩장 발행 API (`app/api/invitations/[id]/publish/route.ts`)
  - 쿠폰 연결 및 사용 처리
  - 슬러그 생성 (신랑-신부-랜덤)
  - 상태 업데이트 (DRAFT → PUBLISHED)
- [x] 발행 모달 UI (`components/editor/PublishModal.tsx`)
  - 쿠폰 입력 및 검증
  - 발행 완료 후 공유 안내

#### User Dashboard (11-user-dashboard.md)
- [x] RSVP 관리 API (`app/api/invitations/[id]/rsvp/route.ts`)
  - GET: RSVP 목록 조회 (페이지네이션)
  - DELETE: RSVP 삭제
- [x] Guestbook 관리 API (`app/api/invitations/[id]/guestbook/route.ts`)
  - GET: 방명록 목록 조회
  - PATCH: 숨기기/보이기 토글
  - DELETE: 방명록 삭제
- [x] RSVP 관리 페이지 (`app/dashboard/[id]/rsvp/page.tsx`)
  - 참석 통계 요약 (참석/불참/총 식사 인원)
  - 신랑/신부측 필터링
  - CSV 내보내기
- [x] Guestbook 관리 페이지 (`app/dashboard/[id]/guestbook/page.tsx`)
  - 숨기기/삭제 기능
  - 비밀 메시지 표시
- [x] 공유 모달 (`components/dashboard/ShareModal.tsx`)
  - QR 코드 생성 (PNG/SVG 다운로드)
  - 카카오톡 공유
  - 링크 복사

#### SEO & Social Sharing (09-seo-social-sharing.md)
- [x] OG 이미지 생성 API (`app/api/og/[slug]/route.tsx`)
  - @vercel/og 사용
  - 800x400px 동적 이미지
  - 커버 사진 + 이름 + 날짜 + 장소
- [x] 청첩장 메타데이터 개선 (`app/i/[slug]/page.tsx`)
  - Open Graph 태그 (title, description, image)
  - Twitter Card 지원
  - noindex (검색 엔진 제외)
- [x] 카카오 공유 유틸리티 (`lib/kakao/share.ts`)
  - SDK 초기화
  - sendDefault API 연동
- [x] sitemap.xml (`app/sitemap.ts`)
- [x] robots.txt (`app/robots.ts`)

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
