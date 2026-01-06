# Mobile Invitation Core Specification

## Overview

모바일 청첩장 서비스 "연정"의 핵심 기능 및 페이지 구성을 정의합니다.
**모바일 퍼스트** 디자인을 원칙으로 하며, 방문자(하객)와 제작자(신랑신부) 모두에게 직관적인 UX를 제공합니다.

## User Roles

| Role | Description |
|------|-------------|
| **Host (Creator)** | 청첩장을 생성, 수정, 관리하는 사용자 (신랑/신부) |
| **Guest (Viewer)** | 청첩장을 수신하고 열람, RSVP 제출, 방명록 작성을 하는 사용자 |

---

## Part 1: Public View (Guest Experience)

하객이 링크를 통해 접속했을 때 보이는 화면입니다.
스크롤 가능한 단일 페이지(SPA)로 구성되며, 논리적인 섹션으로 구분됩니다.

### 1.1. Hero Section (Intro)
| Element | Description |
|---------|-------------|
| 대표 사진 | Full width, 시네마틱 비율 (16:9 또는 4:5) |
| 커플 이름 | 신랑 & 신부 이름 (한글/영문 선택) |
| 예식 정보 | 날짜, 시간, D-Day 카운터 |
| 예식장 명칭 | 장소 이름 (층/홀 정보 포함) |

**Interaction**: 스크롤 시 부드러운 Parallax 효과, 배경음악 자동 재생 옵션

### 1.2. Invitation (Greeting)
| Element | Description |
|---------|-------------|
| 초대 문구 | AI 생성 또는 직접 작성한 감성 문구 |
| 혼주 정보 | 신랑 측/신부 측 부모님 성함 |
| 연락처 연동 | 전화/문자 버튼 (딥링크) |
| 캘린더 뷰 | 해당 월 달력에 예식일 하이라이트 |

### 1.3. Gallery
| Element | Description |
|---------|-------------|
| 그리드 뷰 | 웨딩 화보 썸네일 그리드 (2~3열) |
| Lightbox | 사진 탭 시 전체 화면 확대 |
| 슬라이드 | 좌우 스와이프로 사진 탐색 |
| 시크릿 콘텐츠 | 특정 사진 길게 누르면 숨겨진 영상/사진 노출 (Easter Egg) |

### 1.4. Location (Map)
| Element | Description |
|---------|-------------|
| 지도 | 네이버/카카오 지도 API 연동 |
| 길찾기 | 네이버/카카오/T맵 딥링크 버튼 |
| 주소 복사 | 클립보드 복사 + 토스트 알림 |
| 교통 안내 | 지하철, 버스, 자가용, 주차 정보 Accordion |

### 1.5. Money Gift (Account)
| Element | Description |
|---------|-------------|
| 계좌 목록 | 신랑 측/신부 측 분리 (Accordion UI) |
| 복사 버튼 | 은행명 + 계좌번호 원터치 복사 |
| 카카오페이 | 송금 링크 연동 (Optional) |
| 토스 송금 | 토스 딥링크 연동 (Optional) |

### 1.6. RSVP (Form)
| Field | Type | Required |
|-------|------|----------|
| 참석 의사 | Radio (참석 / 마음만 전함) | ✓ |
| 식사 여부 | Radio (예 / 아니오) | ✓ |
| 동반 인원 | Number Input | ✓ |
| 신랑/신부 측 | Radio | ✓ |
| 성함 | Text Input | ✓ |
| 연락처 | Tel Input | Optional |

### 1.7. Guestbook
| Element | Description |
|---------|-------------|
| 메시지 목록 | 무한 스크롤, 최신순 정렬 |
| 작성 폼 | 이름, 비밀번호, 내용 |
| 삭제 기능 | 비밀번호 확인 후 삭제 |
| 이모지 반응 | 메시지에 하트/축하 이모지 추가 (Optional) |

### 1.8. Calendar Add (캘린더 추가)
| Element | Description |
|---------|-------------|
| 추가 버튼 | "📅 일정 추가하기" 버튼 |
| 지원 캘린더 | Google Calendar, Apple Calendar, 카카오톡 캘린더 |
| 자동 정보 | 제목, 날짜/시간, 장소, 주소 자동 입력 |

**구현 방식**:
```
Google Calendar: webcal URL scheme
Apple Calendar: .ics 파일 다운로드
카카오 캘린더: 카카오톡 공유 시 일정 추가 옵션
```

### 1.9. Contact Call (전화 연결)
| Element | Description |
|---------|-------------|
| 연락처 카드 | 신랑/신부/혼주별 연락처 표시 |
| 전화 버튼 | `tel:` 딥링크로 바로 전화 |
| 문자 버튼 | `sms:` 딥링크로 문자 앱 열기 |
| UI | Accordion으로 "연락하기" 펼침 |

**표시 구조**:
```
연락하기 ▼
├─ 신랑 지훈  [📞 전화] [💬 문자]
├─ 신부 민영  [📞 전화] [💬 문자]  
├─ 신랑 아버지  [📞] [💬]
├─ 신랑 어머니  [📞] [💬]
├─ 신부 아버지  [📞] [💬]
└─ 신부 어머니  [📞] [💬]
```

### 1.10. Flower Guide (화환/축화 안내)
| Element | Description |
|---------|-------------|
| 안내 모드 | 수락 / 정중히 사절 선택 |
| 배송 정보 | 예식장 주소, 예식 홀, 주문 시 이름 |
| 전화번호 | 예식장 또는 꽃집 연락처 |
| 사절 문구 | "축하의 마음만 감사히 받겠습니다" |

### 1.11. Shuttle Bus (셔틀버스 안내) - Optional
| Element | Description |
|---------|-------------|
| 운행 여부 | ON/OFF |
| 노선 정보 | 출발지, 경유지, 도착지 |
| 시간표 | 배차 시간 목록 |
| 탑승 장소 | 지도 또는 텍스트 설명 |

### 1.12. Dress Code (복장 안내) - Optional
| Element | Description |
|---------|-------------|
| 안내 여부 | ON/OFF |
| 가이드 | 자유 텍스트 (예: "화이트 의상은 피해주세요") |

### 1.13. Footer
| Element | Description |
|---------|-------------|
| 카카오톡 공유 | 커스텀 OG 이미지와 함께 공유 |
| 링크 복사 | URL 클립보드 복사 |
| 나도 만들기 | "Made by 연정" 서비스 홍보 링크 |

---

## Section Visibility (기능 표시 제어)

**핵심 원칙: Progressive Disclosure**
> "기능은 많지만, 복잡해 보이지 않게"

### 섹션 분류

| 분류 | 섹션 | 기본값 | 설명 |
|------|------|--------|------|
| **필수** | Hero, Invitation, Gallery, Location, Footer | 항상 ON | 숨길 수 없음 |
| **권장** | Account, RSVP, Guestbook, Calendar, Contact | ON | 끌 수 있음 |
| **선택** | Flower, Shuttle, Dress Code, Secret | OFF | 필요시 켜기 |

### 에디터 UI 적용

```
┌─────────────────────────────────────────────────────────────┐
│  섹션 설정                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📌 기본 섹션 (항상 표시)                                     │
│  ├─ 인트로 (대표사진, 이름, 날짜)                             │
│  ├─ 초대글                                                   │
│  ├─ 갤러리                                                   │
│  └─ 오시는 길                                                │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ✅ 권장 섹션                                                │
│  ├─ [✓] 축의금 계좌                                         │
│  ├─ [✓] 참석 여부 (RSVP)                                    │
│  ├─ [✓] 방명록                                              │
│  ├─ [✓] 캘린더 추가                                         │
│  └─ [✓] 연락하기                                            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ➕ 추가 섹션 (선택)                          [더 보기 ▼]     │
│  ├─ [ ] 화환 안내                                           │
│  ├─ [ ] 셔틀버스                                            │
│  ├─ [ ] 복장 안내                                           │
│  └─ [ ] 시크릿 콘텐츠                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Smart Defaults 전략

| 상황 | 자동 설정 |
|------|----------|
| 청첩장 생성 시 | 필수 + 권장 섹션 ON |
| 계좌 미입력 시 | 계좌 섹션 자동 숨김 |
| 셔틀 정보 없으면 | 셔틀 섹션 표시 안 함 |
| 갤러리 사진 0장 | "사진을 추가해주세요" 안내 |

---

## Part 2: Admin View (Host Experience)

청첩장을 제작하고 관리하는 영역입니다.
Route: `/dashboard` 또는 `/admin`

### 2.1. Dashboard
| Feature | Description |
|---------|-------------|
| 청첩장 목록 | 내 청첩장 카드 뷰 (제작 중 / 배포 중 상태) |
| RSVP 집계 | 신랑측/신부측, 식사 인원, 총 참석자 통계 |
| 하객 인사이트 | 조회수, 인기 사진, 체류 시간 분석 |
| 방명록 관리 | 새 메시지 알림, 관리(삭제) 기능 |

### 2.2. Editor (Step-by-Step Form)

#### Step 1: 기본 정보
- 예식일시 (Date/Time Picker)
- 예식 장소 (검색 + 지도 선택)
- 신랑/신부 정보 (이름, 부모님 성함)

#### Step 2: 디자인 선택
- 테마/스킨 선택 (Preview 포함)
- 컬러 팔레트 커스터마이징
- 폰트 스타일 선택

#### Step 3: 콘텐츠 입력
- 초대글 작성 (AI 추천 or 직접 작성)
- 갤러리 사진 업로드 (Drag & Drop, 최대 30장)
- 시크릿 콘텐츠 설정 (Optional)

#### Step 4: 부가 기능 설정
- RSVP 수집 ON/OFF
- 방명록 ON/OFF
- 계좌 정보 입력
- 배경음악 선택

#### Step 5: 배포 (Publishing)
| Feature | Description |
|---------|-------------|
| Personalized Slug | `yeonjeong.kr/{나만의-주소}` 형태 고유 URL |
| 실시간 중복 체크 | 슬러그 입력 시 사용 가능 여부 확인 |
| QR 코드 생성 | 고해상도 QR 코드 자동 생성 & 다운로드 |
| OG 이미지 설정 | 카카오톡 공유 시 표시될 썸네일 설정 |

#### Real-time Preview
- 에디터 옆에 모바일 목업으로 실시간 미리보기
- 변경사항 즉시 반영

---

## Part 3: Live Wedding Mode

예식 당일 사용하는 특별 모드입니다.

### 3.1. Digital Signage Mode
| Feature | Description |
|---------|-------------|
| 대형 화면 최적화 | 16:9 가로 화면에 최적화된 레이아웃 |
| 방명록 롤링 | 실시간 방명록 메시지 자동 스크롤 |
| 사진 슬라이드쇼 | 갤러리 사진 자동 재생 |
| QR 코드 표시 | 하객들이 스캔하여 바로 접속 |

### 3.2. Host Control Panel
| Feature | Description |
|---------|-------------|
| 표시 콘텐츠 선택 | 방명록 / 사진 / QR 중 선택 |
| 새 메시지 알림 | 방명록 새 글 실시간 알림 |
| 부적절 메시지 숨김 | 즉시 숨김 처리 |

---

## Technical Requirements

### Architecture
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand / React Hook Form |
| Database | PostgreSQL (Prisma) |
| Storage | AWS S3 / Cloudflare R2 |
| CDN | Cloudflare / Vercel Edge |

### Performance Requirements
| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Mobile PageSpeed Score | > 90 |

### Image Optimization
- 대용량 웨딩 사진 자동 리사이징
- WebP/AVIF 자동 변환
- Lazy Loading 적용
- Blur Placeholder 제공

### SEO & Social Sharing
- 동적 Open Graph 메타데이터 생성
- 커스텀 OG 이미지 (카카오톡 최적화)
- JSON-LD 구조화 데이터

---

## Design System

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FDF8F3` | 배경 |
| Peach Light | `#FFE4D6` | 서브 배경 |
| Coral | `#FF8E76` | Primary 액센트 |
| Rose Soft | `#FFB6C1` | Secondary 액센트 |
| Sage | `#A8C5A8` | Tertiary 액센트 |
| Brown | `#5D4E4E` | 텍스트 |

### Typography
| Role | Font | Weight |
|------|------|--------|
| Display (제목) | Nanum Myeongjo | 400, 700 |
| Serif (강조) | Playfair Display | 400 Italic |
| Body (본문) | Noto Sans KR | 400, 500, 700 |

### Component Library
- Shadcn UI 기반 커스텀 컴포넌트
- Radix UI Primitives 활용
- 일관된 border-radius, shadow, spacing 시스템
