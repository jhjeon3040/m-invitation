# Mobile Invitation Core Specification

## Overview
모바일 청첩장 서비스의 핵심 기능 및 페이지 구성을 정의합니다.
"모바일 퍼스트" 디자인을 원칙으로 하며, 방문자(하객)와 제작자(신랑신부) 모두에게 직관적인 UX를 제공해야 합니다.

## User Roles
1. **Host (Creator)**: 청첩장을 생성, 수정, 관리하는 사용자 (신랑/신부).
2. **Guest (Viewer)**: 청첩장을 수신하고 열람, RSVP 제출, 방명록 작성을 하는 사용자.

## Page Structure & Features

### 1. Public View (Guest Experience)
하객이 링크를 통해 접속했을 때 보이는 화면입니다. 스크롤 가능한 단일 페이지(SPA) 또는 논리적인 섹션 구분을 가집니다.

- **Hero Section (Intro)**
  - 대표 사진 (Full width/height interaction)
  - 신랑 & 신부 이름 (영문/한글)
  - 예식 날짜 및 시간 (D-Day 카운터 포함)
  - 예식 장소 명칭

- **Invitation (Greeting)**
  - 초대 문구 (시/글귀)
  - 혼주 정보 (신랑 측 부/모, 신부 측 부/모) 및 연락처(전화/문자) 연동
  - 캘린더 뷰 (해당 월 달력에 예식일 표시)

- **Gallery**
  - 웨딩 화보 그리드 뷰
  - 사진 클릭 시 전체 화면 확대 (Lightbox) 및 슬라이드

- **Location (Map)**
  - 지도 API 연동 (네이버 지도, 카카오맵)
  - "길찾기" 버튼 (네이버/카카오/T맵 딥링크)
  - 주소 복사 버튼
  - 교통편 안내 (지하철, 버스, 자가용, 주차 정보)

- **Money Gift (Account)**
  - 신랑 측 / 신부 측 계좌 목록 (접었다 펴기 - Accordion UI)
  - 계좌번호 복사 버튼
  - 카카오페이 송금 링크 연동 (Optional)

- **RSVP (Form)**
  - 참석 의사 (참석/마음만 전함)
  - 식사 여부
  - 동반 인원 수
  - 신랑/신부 측 구분

- **Guestbook**
  - 축하 메시지 목록 (무한 스크롤)
  - 메시지 작성 폼 (이름, 비밀번호, 내용)

- **Footer**
  - 카카오톡 공유하기 버튼
  - 링크 복사하기 버튼
  - "나도 만들기" (서비스 홍보 링크)

### 2. Admin View (Host Experience)
청첩장을 제작하고 관리하는 영역입니다. `/admin` 또는 `/dashboard` 라우트.

- **Dashboard**
  - 내 청첩장 목록 및 상태 (제작 중, 배포 중)
  - RSVP 집계 현황 (신랑측/신부측, 식사 인원 등 통계)

- **Editor (Form Builder)**
  - **Step 1: 기본 정보**: 예식일, 장소, 신랑/신부 정보.
  - **Step 2: 디자인**: 스킨/테마 선택, 폰트 설정.
  - **Step 3: 콘텐츠**: 초대글 작성, 갤러리 사진 업로드(Drag & Drop).
  - **Step 4: 부가 기능**: RSVP 설정, 방명록 ON/OFF, 계좌 정보 입력.
  - **Step 5: 배포 및 주소 설정 (Publishing)**:
    - **Personalized Slug**: `blanc.kr/{나만의-주소}` 형태의 고유 URL 지정.
    - **Availability Check**: 슬러그 입력 시 실시간으로 사용 가능 여부 확인(Duplicate Check).
    - **QR Code Generation**: 생성된 고유 URL을 담은 고해상도 QR 코드 자동 생성 및 다운로드.
  - **Preview**: 실시간 모바일 뷰 미리보기.

## Technical Considerations
- **Responsive Design**: 모바일 뷰 최우선, 데스크탑에서는 중앙 정렬된 모바일 시뮬레이션 뷰 제공.
- **Image Optimization**: 대용량 웨딩 사진 자동 리사이징 및 WebP 변환 (Next.js Image).
- **SEO/Metadata**: 카카오톡/문자 공유 시 Open Graph (og:image, og:title) 동적 생성 필수.
- **State Management**: RSVP 폼 및 에디터 상태 관리 (Zustand/React Hook Form).
- **Database**: PostgreSQL (Prisma/Drizzle) - 청첩장 데이터, RSVP, 방명록 저장.

## Design System
- **Colors**: Cream, Coral, Brown (기존 테마 유지)
- **Typography**: Serif (Playfair Display) for Headings, Sans (Noto Sans KR) for Body.
- **Components**: Shadcn UI 기반 커스텀 컴포넌트 활용.
