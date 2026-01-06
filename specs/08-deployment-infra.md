# Deployment & Infrastructure Specification

## Overview

"연정" 서비스의 배포 및 인프라 설계 문서입니다.

## Architecture Overview

```
                                    ┌─────────────────┐
                                    │   Cloudflare    │
                                    │   (DNS + CDN)   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────┴────────┐    ┌──────────┴──────────┐    ┌───────┴───────┐
           │     Vercel      │    │   Cloudflare R2    │    │  PostgreSQL   │
           │   (Next.js)     │    │   (Image Storage)  │    │   (Neon.tech) │
           └────────┬────────┘    └─────────────────────┘    └───────────────┘
                    │
           ┌────────┴────────┐
           │   External APIs │
           ├─────────────────┤
           │ • Kakao OAuth   │
           │ • Naver OAuth   │
           │ • Kakao Map     │
           │ • OpenAI (AI글) │
           └─────────────────┘
```

---

## Hosting & Deployment

### Vercel (Primary)

| Aspect | Configuration |
|--------|---------------|
| Framework | Next.js |
| Node Version | 20.x |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm ci` |

#### Environment Configuration
```
# Vercel Project Settings
- Framework Preset: Next.js
- Root Directory: ./
- Build & Development Settings: Auto-detected
```

### Deployment Environments

| Environment | Branch | Domain | Purpose |
|-------------|--------|--------|---------|
| Production | `main` | yeonjeong.kr | 실서비스 |
| Staging | `staging` | staging.yeonjeong.kr | QA 테스트 |
| Preview | PR branches | *.vercel.app | PR 미리보기 |

---

## Domain & DNS

### Domain Configuration

| Domain | Purpose | Provider |
|--------|---------|----------|
| yeonjeong.kr | 메인 도메인 | 가비아/Cloudflare |
| *.yeonjeong.kr | 서브도메인 | Cloudflare |

### DNS Records

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | Vercel IP | 루트 도메인 |
| CNAME | www | cname.vercel-dns.com | www 리다이렉트 |
| CNAME | staging | cname.vercel-dns.com | 스테이징 |
| TXT | @ | vercel-verification=xxx | Vercel 인증 |

### SSL/TLS
- Cloudflare SSL: Full (strict)
- Vercel 자동 SSL 인증서

---

## Database

### PostgreSQL (Neon.tech)

| Aspect | Configuration |
|--------|---------------|
| Provider | Neon.tech |
| Version | PostgreSQL 15 |
| Region | ap-northeast-2 (Seoul) |
| Connection | Connection pooling enabled |

#### Connection String
```
DATABASE_URL="postgresql://user:password@ep-xxx.ap-northeast-2.aws.neon.tech/yeonjeong?sslmode=require"
```

#### Branching Strategy
| Environment | Database Branch |
|-------------|-----------------|
| Production | main |
| Staging | staging |
| Development | dev (or local) |

### Backup Strategy
| Type | Frequency | Retention |
|------|-----------|-----------|
| Point-in-time | 연속 | 7일 |
| Daily Snapshot | 매일 | 30일 |
| Weekly Archive | 매주 | 1년 |

---

## File Storage

### Cloudflare R2

| Aspect | Configuration |
|--------|---------------|
| Bucket | yeonjeong-uploads |
| Region | APAC |
| Access | Public (via custom domain) |

#### Bucket Structure
```
yeonjeong-uploads/
├── gallery/
│   └── {invitationId}/
│       ├── {imageId}.webp
│       └── {imageId}_thumb.webp
├── secret/
│   └── {invitationId}/
│       └── {contentId}.{ext}
├── og/
│   └── {invitationId}.png
└── qr/
    └── {invitationId}.png
```

#### CDN Domain
```
https://cdn.yeonjeong.kr → R2 Bucket
```

### Image Processing

| Process | Tool | Trigger |
|---------|------|---------|
| Resize | Sharp (Edge Function) | Upload 시 |
| WebP 변환 | Sharp | Upload 시 |
| Thumbnail | Sharp | Upload 시 (300x300) |
| OG Image | @vercel/og | Publish 시 |

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=

# Authentication
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# Session
JWT_SECRET=
SESSION_SECRET=

# Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
CDN_URL=

# External APIs
OPENAI_API_KEY=
KAKAO_MAP_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
```

### Environment-specific

| Variable | Production | Staging | Development |
|----------|------------|---------|-------------|
| `NODE_ENV` | production | production | development |
| `NEXT_PUBLIC_APP_URL` | https://yeonjeong.kr | https://staging.yeonjeong.kr | http://localhost:3000 |
| `LOG_LEVEL` | warn | debug | debug |

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: staging.yeonjeong.kr

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Migrations

```yaml
# Migration job (production only)
migrate-database:
  if: github.ref == 'refs/heads/main'
  needs: deploy-production
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci
    - run: npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Monitoring & Logging

### Vercel Analytics
- Web Vitals 자동 수집
- Audience insights
- Real-time logs

### Error Tracking (Sentry)

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Logging Strategy

| Level | Usage | Example |
|-------|-------|---------|
| ERROR | 예외, 실패 | API 오류, DB 연결 실패 |
| WARN | 주의 필요 | Rate limit 근접, 느린 쿼리 |
| INFO | 주요 이벤트 | 청첩장 발행, 쿠폰 사용 |
| DEBUG | 디버깅 | 요청/응답 상세 |

### Health Checks

| Endpoint | Check | Interval |
|----------|-------|----------|
| `/api/health` | App 상태 | 30s |
| `/api/health/db` | DB 연결 | 60s |
| `/api/health/storage` | R2 연결 | 60s |

---

## Security

### Headers (next.config.ts)

```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' https://cdn.yeonjeong.kr data:; ..."
  }
];
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| API 전체 | 100 req | 1분 |
| Auth | 10 req | 1분 |
| Upload | 20 req | 1분 |

### DDoS Protection
- Cloudflare 기본 보호
- Bot Fight Mode 활성화
- Challenge 페이지 (의심 트래픽)

---

## Scaling Considerations

### Current Setup (MVP)
- Vercel Hobby/Pro tier
- Neon Free/Launch tier
- R2 Free tier

### Growth Path

| Stage | Users | Infrastructure |
|-------|-------|----------------|
| MVP | ~1,000 | Current setup |
| Growth | ~10,000 | Vercel Pro, Neon Scale |
| Scale | ~100,000 | Enterprise, Read replicas |

### Performance Targets

| Metric | Target |
|--------|--------|
| TTFB | < 200ms |
| LCP | < 2.5s |
| API Response | < 500ms (p95) |
| Uptime | 99.9% |

---

## Disaster Recovery

### Backup Locations
- Database: Neon 자동 백업 + 수동 덤프 (S3)
- Storage: R2 버저닝 + 크로스 리전 복제
- Config: Git 저장 (환경변수 제외)

### Recovery Procedures

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| DB 장애 | 5분 | 0 | Neon 자동 복구 |
| Storage 장애 | 10분 | 1시간 | R2 버전 복원 |
| 전체 장애 | 30분 | 1시간 | 백업에서 복구 |

### Rollback
```bash
# Vercel 즉시 롤백
vercel rollback [deployment-url]

# DB 롤백
npx prisma migrate resolve --rolled-back [migration-name]
```
