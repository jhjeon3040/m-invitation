# Operations & Monitoring Specification

## Overview

"연정" 서비스의 운영 모니터링, 에러 추적, 알림 및 장애 대응 스펙입니다.

---

## 1. Monitoring Stack

### 1.1. 기술 스택

| Layer | Tool | Purpose |
|-------|------|---------|
| **Error Tracking** | Sentry | 에러 수집 및 알림 |
| **Analytics** | Vercel Analytics | Web Vitals, 트래픽 분석 |
| **Logging** | Vercel Logs | 애플리케이션 로그 |
| **Uptime** | Better Uptime / UptimeRobot | 서비스 가용성 모니터링 |
| **Database** | Neon Dashboard | DB 성능, 쿼리 분석 |
| **CDN** | Cloudflare Analytics | CDN 트래픽, 캐시 히트율 |

### 1.2. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Application                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Next.js App]                                                  │
│        │                                                         │
│        ├──── @sentry/nextjs ────→ [Sentry Cloud]                │
│        │                              │                          │
│        ├──── console.log ───────→ [Vercel Logs]                 │
│        │                              │                          │
│        └──── Web Vitals ────────→ [Vercel Analytics]            │
│                                       │                          │
│                                       ↓                          │
│                              [Alert Channels]                    │
│                              ├── Slack                           │
│                              ├── Email                           │
│                              └── PagerDuty (옵션)                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Error Tracking (Sentry)

### 2.1. 설정

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // 성능 모니터링
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // 세션 리플레이 (프로 플랜)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // 에러 필터링
  ignoreErrors: [
    // 브라우저 확장 에러
    /chrome-extension/,
    /moz-extension/,
    // 네트워크 에러 (일시적)
    "Network request failed",
    "Failed to fetch",
    // 사용자 중단
    "AbortError",
  ],
  
  beforeSend(event, hint) {
    // 개인정보 필터링
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 2.2. 에러 분류

| Level | Description | Alert |
|-------|-------------|-------|
| **Fatal** | 서비스 불가 | 즉시 (Slack + Phone) |
| **Error** | 기능 장애 | 즉시 (Slack) |
| **Warning** | 잠재적 문제 | 일일 리포트 |
| **Info** | 참고 정보 | 주간 리포트 |

### 2.3. 커스텀 컨텍스트

```typescript
// 사용자 컨텍스트 설정
Sentry.setUser({
  id: user.id,
  email: user.email, // 해시 또는 마스킹 권장
});

// 청첩장 관련 에러 컨텍스트
Sentry.setContext("invitation", {
  invitationId: invitation.id,
  status: invitation.status,
  publishedAt: invitation.publishedAt,
});

// 커스텀 에러 전송
Sentry.captureException(error, {
  tags: {
    feature: "rsvp",
    action: "submit",
  },
  extra: {
    requestPayload: sanitizedPayload,
  },
});
```

---

## 3. Health Checks

### 3.1. 엔드포인트

| Endpoint | Check | Response |
|----------|-------|----------|
| `GET /api/health` | App 상태 | `{ status: "ok", timestamp }` |
| `GET /api/health/db` | DB 연결 | `{ status: "ok", latency }` |
| `GET /api/health/storage` | R2 연결 | `{ status: "ok" }` |

### 3.2. 구현

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}

// app/api/health/db/route.ts
export async function GET() {
  const start = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({
      status: "ok",
      latency: Date.now() - start,
    });
  } catch (error) {
    return Response.json(
      { status: "error", message: "Database connection failed" },
      { status: 503 }
    );
  }
}
```

### 3.3. Uptime Monitoring

| Monitor | Endpoint | Interval | Alert Threshold |
|---------|----------|----------|-----------------|
| Main App | `https://yeonjeong.kr/api/health` | 30s | 2 failures |
| Database | `https://yeonjeong.kr/api/health/db` | 60s | 2 failures |
| CDN | `https://cdn.yeonjeong.kr/health.txt` | 60s | 3 failures |

---

## 4. Logging Strategy

### 4.1. Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| `error` | 예외, 실패 | API 오류, DB 연결 실패 |
| `warn` | 주의 필요 | Rate limit 근접, 느린 쿼리 |
| `info` | 주요 이벤트 | 청첩장 발행, 쿠폰 사용 |
| `debug` | 디버깅 (dev only) | 요청/응답 상세 |

### 4.2. 로깅 유틸리티

```typescript
// lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  invitationId?: string;
  action?: string;
  [key: string]: unknown;
}

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (shouldLog("debug")) console.debug(formatLog("debug", message, context));
  },
  info: (message: string, context?: LogContext) => {
    if (shouldLog("info")) console.info(formatLog("info", message, context));
  },
  warn: (message: string, context?: LogContext) => {
    if (shouldLog("warn")) console.warn(formatLog("warn", message, context));
  },
  error: (message: string, error?: Error, context?: LogContext) => {
    if (shouldLog("error")) {
      console.error(formatLog("error", message, context));
      if (error) Sentry.captureException(error);
    }
  },
};

function formatLog(level: LogLevel, message: string, context?: LogContext) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  });
}
```

### 4.3. 주요 로깅 포인트

| Event | Level | Data |
|-------|-------|------|
| 청첩장 발행 | info | invitationId, userId |
| 쿠폰 사용 | info | couponCode, userId |
| RSVP 제출 | info | invitationId, guestCount |
| 결제 완료 | info | orderId, amount |
| API 에러 | error | endpoint, statusCode, error |
| Rate Limit | warn | ip, endpoint, limit |
| 느린 쿼리 (>1s) | warn | query, duration |

---

## 5. Alerting

### 5.1. Alert Channels

| Channel | Purpose | Recipients |
|---------|---------|------------|
| **Slack #alerts-critical** | 긴급 장애 | 전체 팀 |
| **Slack #alerts-warning** | 주의 사항 | 개발팀 |
| **Email** | 일일/주간 리포트 | 팀 리드 |
| **PagerDuty** (옵션) | 심야 긴급 | On-call |

### 5.2. Alert Rules

| Condition | Severity | Channel | Action |
|-----------|----------|---------|--------|
| Health check fail x2 | Critical | #alerts-critical | 즉시 확인 |
| Error rate > 5% (5분) | Critical | #alerts-critical | 롤백 검토 |
| Error rate > 1% (5분) | Warning | #alerts-warning | 모니터링 |
| Response time p95 > 3s | Warning | #alerts-warning | 성능 분석 |
| DB connection fail | Critical | #alerts-critical | 즉시 확인 |
| Storage upload fail x5 | Warning | #alerts-warning | 확인 필요 |
| 쿠폰 재고 < 10 | Info | #alerts-warning | 재고 충전 |

### 5.3. Slack Webhook 예시

```typescript
async function sendSlackAlert(
  channel: "critical" | "warning",
  message: {
    title: string;
    description: string;
    severity: "critical" | "warning" | "info";
    fields?: { name: string; value: string }[];
  }
) {
  const webhookUrl = channel === "critical" 
    ? process.env.SLACK_WEBHOOK_CRITICAL 
    : process.env.SLACK_WEBHOOK_WARNING;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attachments: [{
        color: message.severity === "critical" ? "danger" : "warning",
        title: message.title,
        text: message.description,
        fields: message.fields?.map(f => ({
          title: f.name,
          value: f.value,
          short: true,
        })),
        ts: Math.floor(Date.now() / 1000),
      }],
    }),
  });
}
```

---

## 6. Performance Monitoring

### 6.1. Core Web Vitals 목표

| Metric | Target | Poor |
|--------|--------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 4s |
| **FID** (First Input Delay) | < 100ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| **TTFB** (Time to First Byte) | < 200ms | > 600ms |

### 6.2. API Performance 목표

| Endpoint Type | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| Read (GET) | 100ms | 300ms | 500ms |
| Write (POST/PUT) | 200ms | 500ms | 1s |
| Upload | 1s | 3s | 5s |

### 6.3. 성능 모니터링 구현

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const start = Date.now();
  
  // Response 후 로깅
  const response = NextResponse.next();
  
  response.headers.set("X-Response-Time", `${Date.now() - start}ms`);
  
  // 느린 요청 로깅
  const duration = Date.now() - start;
  if (duration > 1000) {
    logger.warn("Slow request detected", {
      path: request.nextUrl.pathname,
      duration,
      method: request.method,
    });
  }
  
  return response;
}
```

---

## 7. Incident Response

### 7.1. Severity Levels

| Level | Definition | Response Time | Examples |
|-------|------------|---------------|----------|
| **SEV1** | 서비스 전체 장애 | 15분 이내 | 사이트 다운, DB 장애 |
| **SEV2** | 핵심 기능 장애 | 1시간 이내 | 청첩장 발행 불가, 결제 실패 |
| **SEV3** | 일부 기능 장애 | 4시간 이내 | RSVP 오류, 이미지 업로드 실패 |
| **SEV4** | 사소한 문제 | 24시간 이내 | UI 버그, 느린 응답 |

### 7.2. Incident Workflow

```
1. 탐지 (Detection)
   ├─ 자동: 모니터링 알림
   └─ 수동: 사용자 신고
         ↓
2. 초기 대응 (Triage) - 15분 이내
   ├─ Severity 판단
   ├─ 담당자 지정
   └─ 상태 페이지 업데이트
         ↓
3. 조사 (Investigation)
   ├─ 로그 분석
   ├─ 영향 범위 파악
   └─ 근본 원인 식별
         ↓
4. 해결 (Resolution)
   ├─ 임시 조치 (Workaround)
   ├─ 영구 수정 (Fix)
   └─ 배포 또는 롤백
         ↓
5. 사후 조치 (Post-Mortem)
   ├─ 타임라인 문서화
   ├─ 근본 원인 분석
   └─ 재발 방지책 수립
```

### 7.3. Runbook (장애 대응 플레이북)

#### 7.3.1. 웹사이트 접속 불가

```markdown
## 증상
- Health check 실패
- 502/503 에러

## 진단
1. Vercel 대시보드 상태 확인
2. `vercel logs --prod` 로 에러 확인
3. DNS/SSL 상태 확인 (Cloudflare)

## 조치
1. [배포 문제] vercel rollback
2. [Vercel 장애] status.vercel.com 확인, 대기
3. [DNS 문제] Cloudflare 설정 확인

## 에스컬레이션
- 30분 이상 미해결 시 Vercel Support 티켓
```

#### 7.3.2. 데이터베이스 연결 실패

```markdown
## 증상
- /api/health/db 503 응답
- "Connection refused" 에러

## 진단
1. Neon 대시보드 상태 확인
2. Connection pooling 상태 확인
3. DB 용량/연결 수 확인

## 조치
1. [연결 초과] 앱 재배포로 커넥션 리셋
2. [Neon 장애] status.neon.tech 확인
3. [용량 초과] Neon 플랜 업그레이드

## 에스컬레이션
- 15분 이상 미해결 시 Neon Support
```

#### 7.3.3. 이미지 업로드 실패

```markdown
## 증상
- 갤러리 이미지 업로드 에러
- R2 응답 없음

## 진단
1. Cloudflare R2 상태 확인
2. R2 Access Key 유효성 확인
3. Bucket 용량 확인

## 조치
1. [인증 만료] Access Key 재발급
2. [용량 초과] 오래된 이미지 정리 또는 용량 확장
3. [Cloudflare 장애] cloudflarestatus.com 확인

## 에스컬레이션
- 1시간 이상 시 Cloudflare Support
```

#### 7.3.4. 결제 실패 다수 발생

```markdown
## 증상
- 결제 성공률 급감
- PG 에러 로그 증가

## 진단
1. PG사 상태 페이지 확인
2. 결제 API 응답 확인
3. 특정 결제 수단 문제인지 확인

## 조치
1. [PG 장애] 공지 + 대체 결제 수단 안내
2. [설정 오류] PG 연동 설정 확인
3. [카드사 장애] 다른 카드 사용 안내

## 사용자 커뮤니케이션
- "일시적인 결제 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
```

---

## 8. Status Page

### 8.1. 상태 페이지 구성

| Component | Description |
|-----------|-------------|
| **Website** | yeonjeong.kr 접속 |
| **Invitations** | 청첩장 조회/생성 |
| **Payments** | 결제 처리 |
| **Image Upload** | 이미지 업로드 |
| **RSVP** | 참석 응답 기능 |

### 8.2. 상태 표시

| Status | Color | Description |
|--------|-------|-------------|
| Operational | Green | 정상 운영 |
| Degraded | Yellow | 성능 저하 |
| Partial Outage | Orange | 일부 기능 장애 |
| Major Outage | Red | 전체 장애 |

### 8.3. 장애 공지 템플릿

```markdown
## [조사중] 청첩장 접속 오류 발생
**시작 시각**: 2025-01-07 14:30 KST

현재 일부 청첩장 페이지 접속 시 오류가 발생하고 있습니다.
원인을 파악 중이며, 최대한 빠르게 복구하겠습니다.

---

## [해결됨] 청첩장 접속 오류 복구 완료
**시작 시각**: 2025-01-07 14:30 KST
**복구 시각**: 2025-01-07 15:15 KST
**영향 시간**: 약 45분

데이터베이스 연결 문제로 인한 접속 오류가 발생했으며,
현재 정상 복구되었습니다. 불편을 드려 죄송합니다.
```

---

## 9. On-Call Rotation (확장 시)

### 9.1. On-Call 일정

| Week | Primary | Secondary |
|------|---------|-----------|
| 1주차 | 개발자 A | 개발자 B |
| 2주차 | 개발자 B | 개발자 A |
| ... | ... | ... |

### 9.2. On-Call 책임

- 모니터링 알림 확인 및 초기 대응
- SEV1/SEV2 장애 시 15분 내 응답
- 에스컬레이션 판단 및 실행
- 인시던트 기록 및 핸드오프

---

## 10. Metrics Dashboard

### 10.1. 운영 대시보드 구성

```
┌─────────────────────────────────────────────────────────────┐
│                    연정 Operations Dashboard                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Service Health]        [Error Rate]        [Uptime]       │
│  ● All Systems OK        0.02%               99.98%         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [API Latency (p95)]     [Active Users]     [Invitations]   │
│  142ms                   1,234              5,678           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Recent Errors]                                            │
│  • TypeError in /api/rsvp - 3 occurrences - 5 min ago      │
│  • Network timeout - 1 occurrence - 12 min ago             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Deployment History]                                       │
│  • v1.2.3 - 2025-01-07 10:30 - Success                     │
│  • v1.2.2 - 2025-01-06 15:45 - Success                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.2. 주요 모니터링 메트릭

| Category | Metrics |
|----------|---------|
| **Availability** | Uptime %, Health check status |
| **Performance** | Response time (p50, p95, p99), Error rate |
| **Business** | 청첩장 발행 수, RSVP 응답 수, 쿠폰 사용량 |
| **Infrastructure** | DB connections, Storage usage, CDN cache hit |

---

## 11. Environment Variables

```bash
# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Alerting
SLACK_WEBHOOK_CRITICAL=
SLACK_WEBHOOK_WARNING=

# Logging
LOG_LEVEL=info  # debug | info | warn | error
```
