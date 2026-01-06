# Database Schema Specification

## Overview

"연정" 서비스의 데이터베이스 스키마 설계 문서입니다.
PostgreSQL + Prisma ORM을 사용합니다.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    User     │──1:N──│   Invitation    │──1:N──│   Gallery   │
└─────────────┘       └────────┬────────┘       └─────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
      ┌────┴────┐        ┌─────┴─────┐       ┌─────┴─────┐
      │  RSVP   │        │ Guestbook │       │  Coupon   │
      └─────────┘        └───────────┘       └───────────┘
```

---

## Tables

### User

사용자 정보 (OAuth 로그인)

```prisma
model User {
  id            String   @id @default(cuid())
  
  // OAuth Info
  provider      Provider
  providerId    String
  
  // Profile
  email         String   @unique
  name          String
  profileImage  String?
  
  // Status
  status        UserStatus @default(ACTIVE)
  deletedAt     DateTime?
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastLoginAt   DateTime?
  
  // Relations
  invitations   Invitation[]
  sessions      Session[]
  
  @@unique([provider, providerId])
  @@index([email])
}

enum Provider {
  KAKAO
  NAVER
}

enum UserStatus {
  ACTIVE
  PENDING_DELETE
  DELETED
}
```

---

### Session

사용자 세션 관리

```prisma
model Session {
  id           String   @id @default(cuid())
  userId       String
  
  token        String   @unique
  expiresAt    DateTime
  
  // Device Info
  userAgent    String?
  ipAddress    String?
  
  createdAt    DateTime @default(now())
  
  // Relations
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

---

### Invitation

청첩장 메인 테이블

```prisma
model Invitation {
  id            String   @id @default(cuid())
  userId        String
  
  // URL
  slug          String?  @unique
  
  // Status
  status        InvitationStatus @default(DRAFT)
  publishedAt   DateTime?
  expiresAt     DateTime?
  
  // Wedding Info
  weddingDate   DateTime?
  weddingTime   String?           // "14:00"
  
  // Venue
  venueName     String?
  venueAddress  String?
  venueFloor    String?
  venueLat      Float?
  venueLng      Float?
  
  // Groom
  groomName     String
  groomFather   String?
  groomMother   String?
  groomOrder    String?           // "장남"
  groomPhone    String?
  
  // Bride
  brideName     String
  brideFather   String?
  brideMother   String?
  brideOrder    String?           // "장녀"
  bridePhone    String?
  
  // Design
  theme         String   @default("romantic-pink")
  customization Json?    // { primaryColor, fontStyle, layout }
  
  // Content
  invitationMsg String?  @db.Text
  aiGenerated   Boolean  @default(false)
  
  // Settings (JSON)
  settings      Json     @default("{}")
  // {
  //   rsvp: { enabled, askMealCount, maxGuests },
  //   guestbook: { enabled, allowSecret, requireApproval },
  //   music: { enabled, trackId, autoPlay, volume }
  // }
  
  // Accounts (JSON)
  accounts      Json?
  // {
  //   groom: [{ bank, number, holder }],
  //   bride: [{ bank, number, holder }]
  // }
  
  // Secret Content
  secretEnabled Boolean  @default(false)
  secretType    String?  // "image" | "video"
  secretUrl     String?
  secretMessage String?
  secretTrigger String?  // Gallery image ID
  
  // Coupon
  couponId      String?  @unique
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  coupon        Coupon?  @relation(fields: [couponId], references: [id])
  gallery       GalleryImage[]
  rsvpResponses RsvpResponse[]
  guestbookEntries GuestbookEntry[]
  analytics     InvitationAnalytics?
  
  @@index([userId])
  @@index([status])
  @@index([slug])
  @@index([weddingDate])
}

enum InvitationStatus {
  DRAFT
  PUBLISHED
  PRIVATE
  EXPIRED
}
```

---

### GalleryImage

갤러리 이미지

```prisma
model GalleryImage {
  id            String   @id @default(cuid())
  invitationId  String
  
  // Image Info
  url           String
  thumbnailUrl  String
  originalName  String
  size          Int      // bytes
  width         Int
  height        Int
  
  // Order & Cover
  order         Int      @default(0)
  isCover       Boolean  @default(false)
  
  // Timestamps
  createdAt     DateTime @default(now())
  
  // Relations
  invitation    Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  
  @@index([invitationId])
  @@index([invitationId, order])
}
```

---

### Coupon

쿠폰 관리

```prisma
model Coupon {
  id            String   @id @default(cuid())
  
  // Code
  code          String   @unique
  type          CouponType
  
  // Status
  status        CouponStatus @default(ACTIVE)
  
  // Validity
  validFrom     DateTime
  validUntil    DateTime
  
  // Usage
  usedAt        DateTime?
  usedBy        String?
  
  // Metadata
  batchId       String?
  note          String?
  
  // Timestamps
  createdAt     DateTime @default(now())
  createdBy     String   // Admin ID
  
  // Relations
  invitation    Invitation?
  
  @@index([code])
  @@index([status])
  @@index([batchId])
  @@index([validUntil])
}

enum CouponType {
  STANDARD
  PROMO
  PARTNER
  GIFT
}

enum CouponStatus {
  ACTIVE
  USED
  EXPIRED
  REVOKED
}
```

---

### RsvpResponse

참석 의사 응답

```prisma
model RsvpResponse {
  id            String   @id @default(cuid())
  invitationId  String
  
  // Response
  name          String
  phone         String?
  attending     Boolean
  mealCount     Int      @default(0)
  side          Side
  
  // Timestamps
  createdAt     DateTime @default(now())
  
  // Relations
  invitation    Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  
  @@index([invitationId])
  @@index([invitationId, side])
}

enum Side {
  GROOM
  BRIDE
}
```

---

### GuestbookEntry

방명록 메시지

```prisma
model GuestbookEntry {
  id            String   @id @default(cuid())
  invitationId  String
  
  // Content
  name          String
  passwordHash  String
  message       String   @db.Text
  
  // Visibility
  isSecret      Boolean  @default(false)
  isApproved    Boolean  @default(true)
  isHidden      Boolean  @default(false)
  
  // Timestamps
  createdAt     DateTime @default(now())
  
  // Relations
  invitation    Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  
  @@index([invitationId])
  @@index([invitationId, createdAt])
}
```

---

### InvitationAnalytics

청첩장 통계

```prisma
model InvitationAnalytics {
  id            String   @id @default(cuid())
  invitationId  String   @unique
  
  // Views
  totalViews    Int      @default(0)
  uniqueViews   Int      @default(0)
  
  // Engagement
  avgDuration   Int      @default(0)  // seconds
  galleryViews  Int      @default(0)
  
  // Updated
  updatedAt     DateTime @updatedAt
  
  // Relations
  invitation    Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)
}
```

---

### ViewLog

조회 로그 (상세 분석용)

```prisma
model ViewLog {
  id            String   @id @default(cuid())
  invitationId  String
  
  // Visitor Info
  sessionId     String
  ipAddress     String?
  userAgent     String?
  referrer      String?
  
  // Timestamps
  viewedAt      DateTime @default(now())
  duration      Int?     // seconds
  
  @@index([invitationId])
  @@index([invitationId, viewedAt])
  @@index([sessionId])
}
```

---

### Admin

관리자 계정

```prisma
model Admin {
  id            String   @id @default(cuid())
  
  email         String   @unique
  passwordHash  String
  name          String
  
  role          AdminRole @default(OPERATOR)
  
  createdAt     DateTime @default(now())
  lastLoginAt   DateTime?
  
  @@index([email])
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  OPERATOR
}
```

---

### AuditLog

감사 로그

```prisma
model AuditLog {
  id            String   @id @default(cuid())
  
  // Actor
  actorType     String   // "user" | "admin" | "system"
  actorId       String?
  
  // Action
  action        String   // "coupon.create", "invitation.publish", etc.
  resourceType  String   // "coupon", "invitation", "user"
  resourceId    String?
  
  // Details
  details       Json?
  ipAddress     String?
  
  // Timestamp
  createdAt     DateTime @default(now())
  
  @@index([actorType, actorId])
  @@index([resourceType, resourceId])
  @@index([action])
  @@index([createdAt])
}
```

---

## Indexes Strategy

### Performance Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| User | email | 로그인, 중복 체크 |
| User | provider + providerId | OAuth 조회 |
| Invitation | userId | 사용자별 청첩장 목록 |
| Invitation | slug | 공개 URL 조회 |
| Invitation | status | 상태별 필터링 |
| Coupon | code | 쿠폰 검증 |
| RsvpResponse | invitationId | 청첩장별 RSVP 목록 |
| GuestbookEntry | invitationId + createdAt | 최신순 방명록 |
| ViewLog | invitationId + viewedAt | 기간별 통계 |

### Composite Indexes

```prisma
// 사용자의 발행된 청첩장만 조회
@@index([userId, status])

// 특정 날짜 이후 예식 청첩장
@@index([status, weddingDate])

// 만료 예정 쿠폰 조회
@@index([status, validUntil])
```

---

## Data Retention Policy

| Data Type | Retention | Action |
|-----------|-----------|--------|
| Active User | 무기한 | - |
| Deleted User | 30일 | 완전 삭제 |
| Published Invitation | 예식일 + 1년 | 자동 비공개 |
| Draft Invitation | 90일 미수정 | 삭제 경고 → 삭제 |
| ViewLog | 1년 | 집계 후 삭제 |
| AuditLog | 3년 | 아카이브 |

---

## Migration Notes

### Initial Migration
```bash
npx prisma migrate dev --name init
```

### Adding New Fields
- Optional 필드로 추가 권장
- Required 필드는 default 값 필수

### Destructive Changes
- 컬럼 삭제 시 2단계 마이그레이션
  1. 코드에서 사용 제거
  2. 다음 배포에서 컬럼 삭제
