# Coupon & Publishing System Specification

## Overview

"연정" 서비스는 **쿠폰 기반 발행 시스템**을 사용합니다.
사용자는 청첩장을 무료로 제작할 수 있으며, **발행(Publish) 시점에 쿠폰을 사용**합니다.

## Business Model

### Flow
```
[무료 제작] → [미리보기] → [쿠폰 입력] → [발행] → [공유]
```

### Key Concepts
| Term | Description |
|------|-------------|
| **Draft** | 제작 중인 청첩장 (비공개, 무제한 수정) |
| **Published** | 발행된 청첩장 (공개 URL 활성화) |
| **Coupon** | 발행에 필요한 1회용 코드 |

---

## Coupon System

### Coupon Types

| Type | Code Format | Validity | Description |
|------|-------------|----------|-------------|
| **Standard** | `YJ-XXXX-XXXX` | 1년 | 일반 판매 쿠폰 |
| **Promo** | `PROMO-XXXXX` | 이벤트 기간 | 프로모션/이벤트 쿠폰 |
| **Partner** | `PTN-XXXXX` | 협약 기간 | 제휴사 발급 쿠폰 |
| **Gift** | `GIFT-XXXXX` | 6개월 | 선물용 쿠폰 |

### Coupon Properties

```typescript
interface Coupon {
  id: string;
  code: string;                    // 고유 코드
  type: 'standard' | 'promo' | 'partner' | 'gift';
  status: 'active' | 'used' | 'expired' | 'revoked';
  
  // 유효 기간
  validFrom: Date;
  validUntil: Date;
  
  // 사용 정보
  usedAt?: Date;
  usedBy?: string;                 // User ID
  invitationId?: string;           // 사용된 청첩장 ID
  
  // 메타데이터
  createdAt: Date;
  createdBy: string;               // Admin ID or System
  batchId?: string;                // 일괄 생성 시 배치 ID
  note?: string;                   // 관리용 메모
}
```

### Coupon Code Generation

```typescript
// Code format: PREFIX-XXXX-XXXX (총 14자)
function generateCouponCode(type: CouponType): string {
  const prefix = {
    standard: 'YJ',
    promo: 'PROMO',
    partner: 'PTN',
    gift: 'GIFT',
  }[type];
  
  const randomPart = generateSecureRandom(8); // 영문대문자 + 숫자
  return `${prefix}-${randomPart.slice(0, 4)}-${randomPart.slice(4)}`;
}

// 예: YJ-A3B7-K9M2, PROMO-X7Y2-P4Q8
```

### Validation Rules

| Rule | Description |
|------|-------------|
| 형식 검증 | 정규식 패턴 매칭 |
| 존재 여부 | DB에 해당 코드 존재 확인 |
| 상태 확인 | status === 'active' |
| 기간 확인 | validFrom ≤ now ≤ validUntil |
| 중복 사용 | 이미 사용된 쿠폰인지 확인 |

---

## Publishing Flow

### State Machine

```
┌─────────┐     저장      ┌─────────┐
│  Empty  │ ─────────────→│  Draft  │
└─────────┘               └────┬────┘
                               │
                               │ 쿠폰 사용 + 발행
                               ↓
                         ┌─────────────┐
                         │  Published  │
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              ↓                 ↓                 ↓
        ┌──────────┐     ┌──────────┐     ┌──────────┐
        │ Editing  │     │  Active  │     │ Expired  │
        │ (수정중) │     │  (공개)  │     │ (만료)   │
        └──────────┘     └──────────┘     └──────────┘
```

### Publishing Process

```typescript
async function publishInvitation(invitationId: string, couponCode: string) {
  // 1. 청첩장 상태 확인
  const invitation = await getInvitation(invitationId);
  if (invitation.status !== 'draft') {
    throw new Error('이미 발행된 청첩장입니다.');
  }
  
  // 2. 쿠폰 검증
  const coupon = await validateCoupon(couponCode);
  if (!coupon.valid) {
    throw new Error(coupon.error);
  }
  
  // 3. 필수 정보 확인
  const validation = validateInvitationData(invitation);
  if (!validation.valid) {
    throw new Error(`필수 정보가 누락되었습니다: ${validation.missing.join(', ')}`);
  }
  
  // 4. 트랜잭션 시작
  await transaction(async (tx) => {
    // 4a. 쿠폰 사용 처리
    await tx.coupon.update({
      where: { code: couponCode },
      data: {
        status: 'used',
        usedAt: new Date(),
        usedBy: invitation.userId,
        invitationId: invitation.id,
      },
    });
    
    // 4b. 청첩장 발행 처리
    await tx.invitation.update({
      where: { id: invitationId },
      data: {
        status: 'published',
        publishedAt: new Date(),
        couponId: coupon.id,
      },
    });
    
    // 4c. URL 활성화
    await activatePublicUrl(invitation.slug);
  });
  
  // 5. 발행 완료 알림
  await sendPublishNotification(invitation);
  
  return { success: true, url: `https://yeonjeong.kr/${invitation.slug}` };
}
```

### Required Fields for Publishing

| Category | Required Fields |
|----------|-----------------|
| 기본 정보 | 예식일, 예식 시간, 예식장 |
| 신랑 정보 | 이름 |
| 신부 정보 | 이름 |
| 디자인 | 테마 선택 |
| 콘텐츠 | 초대글, 대표 사진 1장 이상 |
| URL | 고유 슬러그 |

---

## Post-Publishing

### 수정 가능 항목 (발행 후)
| Category | Editable | Note |
|----------|----------|------|
| 초대글 | ✓ | |
| 갤러리 사진 | ✓ | 추가/삭제/순서변경 |
| 계좌 정보 | ✓ | |
| RSVP 설정 | ✓ | |
| 방명록 설정 | ✓ | |
| 연락처 | ✓ | |
| 테마/디자인 | ✓ | |
| 예식 정보 | ✓ | 날짜/시간/장소 |
| URL 슬러그 | ✗ | 발행 후 변경 불가 |

### 청첩장 비공개 처리
- 사용자가 직접 비공개 설정 가능
- 비공개 시 URL 접근 → "비공개 처리된 청첩장입니다" 메시지
- 비공개 해제 시 동일 URL로 다시 공개

### 자동 만료
| Trigger | Action |
|---------|--------|
| 예식일 + 1년 | 자동 비공개 전환 |
| 만료 30일 전 | 이메일/앱 알림 |
| 만료 7일 전 | 최종 알림 |

---

## Coupon Distribution Channels

> 📌 **상세 스펙**: [21-coupon-acquisition.md](./21-coupon-acquisition.md) 참조
> 
> 연정은 **직접 PG 연동 없이** 외부 플랫폼을 통해 쿠폰을 판매합니다.

### 1. 주요 판매 채널

| Platform | Description | 우선순위 |
|----------|-------------|----------|
| **네이버 스마트스토어** | 네이버페이 결제, 알림톡 자동 발송 | ⭐ 메인 |
| 카카오 선물하기 | 기프티콘 형태, 선물하기 바이럴 | Phase 2 |
| 쿠팡 | 폭넓은 사용자층 | Phase 2 |

### 2. 제휴 판매 (B2B)

| Partner Type | Example |
|--------------|---------|
| 웨딩홀/스튜디오 | 계약 고객에게 쿠폰 제공 |
| 웨딩 플래너 | 플래너 전용 쿠폰 배포 |
| 웨딩 박람회 | 현장 판매/프로모션 쿠폰 |

### 3. 프로모션

| Type | Description |
|------|-------------|
| 시즌 프로모션 | 봄/가을 웨딩 시즌 할인 |
| 오픈 프로모션 | 출시 후 3개월 25% 할인 |
| 추천인 | 기존 사용자 추천 시 할인 쿠폰 |

### 4. 서비스 내 결제

**직접 결제 기능은 MVP에 포함하지 않습니다.**
- 사용자는 외부 채널에서 쿠폰 구매 후 코드 입력
- 쿠폰 없는 사용자에게는 네이버 스마트스토어로 안내

---

## Coupon Management (Admin)

### Batch Generation
```typescript
interface CouponBatchRequest {
  type: CouponType;
  count: number;                   // 생성 수량
  validFrom: Date;
  validUntil: Date;
  note?: string;                   // 배치 설명 (예: "2025 봄 프로모션")
}

// 예: 1000개 프로모션 쿠폰 일괄 생성
await createCouponBatch({
  type: 'promo',
  count: 1000,
  validFrom: new Date('2025-03-01'),
  validUntil: new Date('2025-05-31'),
  note: '2025 봄 웨딩 시즌 프로모션',
});
```

### Export/Import
- CSV 형식으로 쿠폰 목록 내보내기
- 제휴사 전달용 쿠폰 코드 파일 생성
- 외부 발급 쿠폰 일괄 등록

### Analytics
| Metric | Description |
|--------|-------------|
| 발급 수 | 총 발급된 쿠폰 수 |
| 사용률 | 사용된 쿠폰 / 발급된 쿠폰 |
| 만료율 | 미사용 만료 쿠폰 비율 |
| 채널별 사용 | 판매 채널별 사용 현황 |

---

## Error Handling

### Coupon Errors
| Error Code | Message | Action |
|------------|---------|--------|
| `INVALID_FORMAT` | 쿠폰 코드 형식이 올바르지 않습니다 | 재입력 안내 |
| `NOT_FOUND` | 존재하지 않는 쿠폰입니다 | 재입력 안내 |
| `ALREADY_USED` | 이미 사용된 쿠폰입니다 | 새 쿠폰 안내 |
| `EXPIRED` | 만료된 쿠폰입니다 | 새 쿠폰 안내 |
| `NOT_YET_VALID` | 아직 사용 기간이 아닙니다 | 유효 기간 안내 |

### Publishing Errors
| Error Code | Message | Action |
|------------|---------|--------|
| `MISSING_REQUIRED` | 필수 정보가 누락되었습니다 | 해당 단계로 이동 |
| `SLUG_TAKEN` | 이미 사용 중인 주소입니다 | 다른 주소 입력 |
| `ALREADY_PUBLISHED` | 이미 발행된 청첩장입니다 | - |

---

## Security Considerations

### Coupon Code Security
- 예측 불가능한 랜덤 코드 생성 (crypto.randomBytes)
- Rate limiting: 쿠폰 검증 API 분당 10회 제한
- 연속 실패 시 임시 차단 (5회 실패 → 5분 대기)

### Fraud Prevention
| Measure | Description |
|---------|-------------|
| IP 추적 | 비정상적인 쿠폰 검증 시도 모니터링 |
| 계정 연동 | 한 계정당 사용 가능한 쿠폰 수 제한 (기본 5개) |
| 감사 로그 | 모든 쿠폰 사용 이력 기록 |

### Refund Policy
- 발행 후 24시간 이내: 쿠폰 복원 가능 (1회 한정)
- 24시간 이후: 쿠폰 복원 불가, 청첩장 비공개만 가능
