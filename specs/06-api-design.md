# API Design Specification

## Overview

"연정" 서비스의 REST API 설계 문서입니다.
Next.js App Router의 Route Handlers를 사용합니다.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://yeonjeong.kr/api` |
| Staging | `https://staging.yeonjeong.kr/api` |
| Development | `http://localhost:3000/api` |

## Authentication

### Headers
```
Authorization: Bearer <access_token>
```

### Error Response (Unauthorized)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-07T12:00:00Z"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자 친화적 메시지",
    "details": { ... }  // Optional
  }
}
```

### Pagination Response
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## API Endpoints

### Auth

#### `GET /api/auth/kakao`
카카오 OAuth 로그인 시작

**Response**: Redirect to Kakao OAuth

---

#### `GET /api/auth/kakao/callback`
카카오 OAuth 콜백

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| code | string | Authorization code |
| state | string | CSRF token |

**Response**: Redirect to `/dashboard` (with session cookie)

---

#### `GET /api/auth/naver`
네이버 OAuth 로그인 시작

---

#### `GET /api/auth/naver/callback`
네이버 OAuth 콜백

---

#### `POST /api/auth/logout`
로그아웃

**Response**:
```json
{
  "data": { "success": true }
}
```

---

#### `GET /api/auth/me`
현재 로그인 사용자 정보

**Response**:
```json
{
  "data": {
    "id": "user_xxx",
    "email": "user@example.com",
    "name": "홍길동",
    "profileImage": "https://...",
    "provider": "kakao",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### User

#### `PATCH /api/user/profile`
프로필 수정

**Request Body**:
```json
{
  "name": "새 이름",
  "profileImage": "https://..."
}
```

---

#### `DELETE /api/user/account`
회원 탈퇴

**Request Body**:
```json
{
  "keepInvitations": false  // true: 청첩장 유지, false: 함께 삭제
}
```

---

### Invitations

#### `GET /api/invitations`
내 청첩장 목록

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | all | draft, published, expired |
| page | number | 1 | 페이지 번호 |
| limit | number | 20 | 페이지당 개수 |

**Response**:
```json
{
  "data": [
    {
      "id": "inv_xxx",
      "slug": "minyoung-jihun",
      "status": "published",
      "groomName": "지훈",
      "brideName": "민영",
      "weddingDate": "2025-05-16",
      "weddingTime": "14:00",
      "venue": "더채플앳청담",
      "theme": "romantic-pink",
      "coverImage": "https://...",
      "createdAt": "2025-01-01T00:00:00Z",
      "publishedAt": "2025-01-05T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

---

#### `POST /api/invitations`
새 청첩장 생성

**Request Body**:
```json
{
  "groomName": "지훈",
  "brideName": "민영"
}
```

**Response**:
```json
{
  "data": {
    "id": "inv_xxx",
    "status": "draft"
  }
}
```

---

#### `GET /api/invitations/:id`
청첩장 상세 조회

**Response**:
```json
{
  "data": {
    "id": "inv_xxx",
    "slug": "minyoung-jihun",
    "status": "draft",
    
    "weddingDate": "2025-05-16",
    "weddingTime": "14:00",
    "venue": {
      "name": "더채플앳청담",
      "address": "서울시 강남구...",
      "floor": "3층 그랜드홀",
      "lat": 37.123,
      "lng": 127.456
    },
    
    "groom": {
      "name": "지훈",
      "fatherName": "아버지",
      "motherName": "어머니",
      "order": "장남",
      "phone": "010-1234-5678"
    },
    "bride": {
      "name": "민영",
      "fatherName": "아버지",
      "motherName": "어머니",
      "order": "장녀",
      "phone": "010-8765-4321"
    },
    
    "theme": "romantic-pink",
    "customization": {
      "primaryColor": "#FF8E76",
      "fontStyle": "classic",
      "layout": "default"
    },
    
    "invitation": {
      "message": "소중한 분들을 초대합니다...",
      "aiGenerated": true
    },
    
    "gallery": [
      {
        "id": "img_xxx",
        "url": "https://...",
        "thumbnailUrl": "https://...",
        "order": 1,
        "isCover": true
      }
    ],
    
    "secretContent": {
      "enabled": true,
      "triggerImageId": "img_xxx",
      "contentType": "image",
      "contentUrl": "https://...",
      "message": "우리만의 비밀 사진!"
    },
    
    "settings": {
      "rsvp": {
        "enabled": true,
        "askMealCount": true,
        "maxGuests": null
      },
      "guestbook": {
        "enabled": true,
        "allowSecret": true,
        "requireApproval": false
      },
      "music": {
        "enabled": true,
        "trackId": "bgm_001",
        "autoPlay": false,
        "volume": 50
      }
    },
    
    "accounts": {
      "groom": [
        { "bank": "국민은행", "number": "123-456-789", "holder": "김지훈" }
      ],
      "bride": [
        { "bank": "신한은행", "number": "987-654-321", "holder": "이민영" }
      ]
    },
    
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-05T00:00:00Z",
    "publishedAt": null
  }
}
```

---

#### `PATCH /api/invitations/:id`
청첩장 수정

**Request Body**: 수정할 필드만 포함 (Partial Update)
```json
{
  "weddingDate": "2025-06-20",
  "invitation": {
    "message": "새로운 초대 문구"
  }
}
```

---

#### `DELETE /api/invitations/:id`
청첩장 삭제

**Response**:
```json
{
  "data": { "success": true }
}
```

---

#### `POST /api/invitations/:id/publish`
청첩장 발행

**Request Body**:
```json
{
  "couponCode": "YJ-A3B7-K9M2",
  "slug": "minyoung-jihun"
}
```

**Response**:
```json
{
  "data": {
    "success": true,
    "url": "https://yeonjeong.kr/minyoung-jihun",
    "qrCodeUrl": "https://..."
  }
}
```

---

#### `POST /api/invitations/:id/unpublish`
청첩장 비공개 처리

---

### Gallery

#### `POST /api/invitations/:id/gallery`
사진 업로드

**Request**: `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| images | File[] | 이미지 파일들 (최대 10개/요청) |

**Response**:
```json
{
  "data": [
    {
      "id": "img_xxx",
      "url": "https://...",
      "thumbnailUrl": "https://..."
    }
  ]
}
```

---

#### `PATCH /api/invitations/:id/gallery/reorder`
사진 순서 변경

**Request Body**:
```json
{
  "imageIds": ["img_3", "img_1", "img_2"]
}
```

---

#### `DELETE /api/invitations/:id/gallery/:imageId`
사진 삭제

---

### AI

#### `POST /api/ai/invitation-message`
AI 초대글 생성

**Request Body**:
```json
{
  "meetingContext": "소개팅",
  "mood": "따뜻한",
  "keywords": ["5년", "대학동기", "캠퍼스커플"],
  "groomName": "지훈",
  "brideName": "민영"
}
```

**Response**:
```json
{
  "data": {
    "suggestions": [
      {
        "id": "sug_1",
        "message": "캠퍼스의 따뜻한 봄날, 우연히 마주친 두 사람이..."
      },
      {
        "id": "sug_2", 
        "message": "5년간의 사랑을 담아, 이제 평생을 약속하려 합니다..."
      },
      {
        "id": "sug_3",
        "message": "소중한 인연으로 만나 사랑을 키워온 저희가..."
      }
    ]
  }
}
```

---

### RSVP

#### `GET /api/invitations/:id/rsvp`
RSVP 목록 조회 (Host 전용)

**Response**:
```json
{
  "data": {
    "summary": {
      "total": 150,
      "attending": 120,
      "notAttending": 30,
      "mealCount": 100,
      "groomSide": 70,
      "brideSide": 80
    },
    "responses": [
      {
        "id": "rsvp_xxx",
        "name": "김철수",
        "attending": true,
        "mealCount": 2,
        "side": "groom",
        "phone": "010-1234-5678",
        "createdAt": "2025-01-05T10:00:00Z"
      }
    ]
  }
}
```

---

#### `POST /api/invitations/:slug/rsvp`
RSVP 제출 (Guest용, Public)

**Request Body**:
```json
{
  "name": "김철수",
  "attending": true,
  "mealCount": 2,
  "side": "groom",
  "phone": "010-1234-5678"
}
```

---

### Guestbook

#### `GET /api/invitations/:slug/guestbook`
방명록 목록 (Public)

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |

---

#### `POST /api/invitations/:slug/guestbook`
방명록 작성 (Public)

**Request Body**:
```json
{
  "name": "축하해요",
  "password": "1234",
  "message": "결혼 진심으로 축하해!",
  "isSecret": false
}
```

---

#### `DELETE /api/invitations/:slug/guestbook/:id`
방명록 삭제

**Request Body**:
```json
{
  "password": "1234"
}
```

---

### Coupons

#### `POST /api/coupons/validate`
쿠폰 유효성 검증

**Request Body**:
```json
{
  "code": "YJ-A3B7-K9M2"
}
```

**Response (Valid)**:
```json
{
  "data": {
    "valid": true,
    "type": "standard",
    "expiresAt": "2026-01-01T00:00:00Z"
  }
}
```

**Response (Invalid)**:
```json
{
  "error": {
    "code": "COUPON_EXPIRED",
    "message": "만료된 쿠폰입니다."
  }
}
```

---

### Public

#### `GET /api/public/:slug`
공개 청첩장 조회 (비로그인 접근)

**Response**: 청첩장 공개 데이터 (민감 정보 제외)

---

#### `POST /api/public/:slug/view`
조회수 기록

---

### Analytics

#### `GET /api/invitations/:id/analytics`
청첩장 통계 (Host 전용)

**Response**:
```json
{
  "data": {
    "views": {
      "total": 1500,
      "unique": 800,
      "today": 50
    },
    "engagement": {
      "avgDuration": 45,
      "galleryViews": 2500,
      "topImages": [
        { "imageId": "img_xxx", "views": 500 }
      ]
    },
    "rsvp": {
      "responseRate": 0.75,
      "attendingRate": 0.80
    },
    "traffic": {
      "kakao": 60,
      "direct": 25,
      "other": 15
    }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 400 | 입력값 오류 |
| `CONFLICT` | 409 | 충돌 (중복 슬러그 등) |
| `RATE_LIMIT` | 429 | 요청 제한 초과 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |
| `COUPON_INVALID` | 400 | 잘못된 쿠폰 |
| `COUPON_EXPIRED` | 400 | 만료된 쿠폰 |
| `COUPON_USED` | 400 | 사용된 쿠폰 |
| `ALREADY_PUBLISHED` | 400 | 이미 발행됨 |

---

## Rate Limiting

| Endpoint Pattern | Limit |
|------------------|-------|
| `/api/auth/*` | 10/min/IP |
| `/api/ai/*` | 5/min/user |
| `/api/coupons/validate` | 10/min/IP |
| `/api/public/*` | 100/min/IP |
| Default | 60/min/user |

**Response Header**:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704628800
```
