# QA Test Checklist Specification

## Overview

"연정" 서비스의 QA 테스트 체크리스트입니다.
기능별, 기기별, 브라우저별 테스트 항목을 정의합니다.

---

## 1. Test Environment Matrix

### 1.1. 모바일 기기

| Priority | Device | OS | Screen | Test Focus |
|----------|--------|-----|--------|------------|
| **P0** | iPhone 15 Pro | iOS 17+ | 6.1" | 최신 iOS |
| **P0** | iPhone 13 | iOS 16+ | 6.1" | 일반 iOS |
| **P0** | Galaxy S24 | Android 14 | 6.2" | 최신 Android |
| **P0** | Galaxy S21 | Android 13 | 6.2" | 일반 Android |
| **P1** | iPhone SE (3rd) | iOS 16+ | 4.7" | 소형 화면 |
| **P1** | Galaxy A54 | Android 13 | 6.4" | 중저가 Android |
| **P2** | iPad Pro | iPadOS 17 | 12.9" | 태블릿 |
| **P2** | Galaxy Tab S9 | Android 13 | 11" | 안드로이드 태블릿 |

### 1.2. 브라우저 환경

| Priority | Browser | Version | Platform |
|----------|---------|---------|----------|
| **P0** | 카카오톡 인앱 | 최신 | iOS, Android |
| **P0** | 네이버 인앱 | 최신 | iOS, Android |
| **P0** | Safari Mobile | 최신 | iOS |
| **P0** | Chrome Mobile | 최신 | Android |
| **P1** | Chrome Desktop | 최신 | macOS, Windows |
| **P1** | Safari Desktop | 최신 | macOS |
| **P2** | Firefox | 최신 | Desktop |
| **P2** | Edge | 최신 | Windows |

### 1.3. 네트워크 환경

| Condition | Test Scenario |
|-----------|---------------|
| **5G/LTE** | 정상 속도 |
| **3G Slow** | 느린 네트워크 (이미지 로딩) |
| **Offline** | 오프라인 에러 처리 |
| **Wifi** | 일반 환경 |

---

## 2. Functional Test Checklist

### 2.1. 랜딩 페이지

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| LP-01 | 페이지 로딩 | 3초 이내 로딩 완료 | P0 |
| LP-02 | Hero 섹션 표시 | 이미지, 텍스트 정상 표시 | P0 |
| LP-03 | 애니메이션 동작 | 스크롤 애니메이션 부드럽게 동작 | P1 |
| LP-04 | CTA 버튼 클릭 | 회원가입/로그인 페이지 이동 | P0 |
| LP-05 | 반응형 레이아웃 | 모바일/태블릿/데스크탑 정상 | P0 |
| LP-06 | Footer 링크 | 이용약관, 개인정보처리방침 이동 | P1 |

### 2.2. 인증 (로그인/회원가입)

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| AU-01 | 카카오 로그인 | 카카오 OAuth 정상 동작 | P0 |
| AU-02 | 네이버 로그인 | 네이버 OAuth 정상 동작 | P0 |
| AU-03 | 신규 가입 플로우 | 약관 동의 → 가입 완료 | P0 |
| AU-04 | 기존 회원 로그인 | 바로 대시보드 이동 | P0 |
| AU-05 | 로그아웃 | 세션 종료, 홈으로 이동 | P1 |
| AU-06 | 약관 동의 체크 | 필수 동의 미체크 시 진행 불가 | P0 |
| AU-07 | 마케팅 동의 (선택) | 미체크로 기본, 선택적 체크 | P2 |
| AU-08 | OAuth 에러 처리 | 에러 메시지 표시, 재시도 가능 | P1 |

### 2.3. 청첩장 에디터

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| ED-01 | Quick Setup 진입 | 3필드 폼 표시 (예식일, 예식장, 이름) | P0 |
| ED-02 | 예식일 선택 | 날짜 피커 정상 동작 | P0 |
| ED-03 | 예식장 검색 | 장소 검색 및 선택 | P0 |
| ED-04 | 신랑/신부 이름 입력 | 한글 입력 정상 | P0 |
| ED-05 | 사진 업로드 (단일) | 10MB 이하 이미지 업로드 | P0 |
| ED-06 | 사진 업로드 (다중) | 최대 30장 업로드 | P0 |
| ED-07 | 사진 크롭 | 크롭 기능 정상 동작 | P1 |
| ED-08 | 사진 삭제 | 선택 삭제 정상 | P1 |
| ED-09 | 테마 선택 | 테마 변경 즉시 반영 | P0 |
| ED-10 | 컬러 변경 | 메인 컬러 변경 반영 | P1 |
| ED-11 | 폰트 변경 | 폰트 변경 반영 | P1 |
| ED-12 | 미리보기 | 실제 청첩장 미리보기 | P0 |
| ED-13 | 자동 저장 | 변경사항 자동 저장 | P0 |
| ED-14 | 임시 저장 후 복귀 | 저장된 내용 유지 | P1 |

### 2.4. 청첩장 발행

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| PB-01 | 쿠폰 보유 상태 확인 | 보유 쿠폰 수 표시 | P0 |
| PB-02 | 쿠폰 없이 발행 시도 | 쿠폰 구매 안내 | P0 |
| PB-03 | 발행 확인 모달 | 발행 전 최종 확인 | P0 |
| PB-04 | 발행 성공 | 청첩장 URL 생성, 공유 버튼 표시 | P0 |
| PB-05 | 발행 후 수정 | 내용 수정 정상 동작 | P0 |
| PB-06 | 발행 취소 (24h 이내) | 쿠폰 복원, 청첩장 비공개 | P1 |
| PB-07 | URL 커스터마이징 | slug 변경 정상 반영 | P1 |
| PB-08 | 중복 URL 처리 | 중복 시 에러 메시지 | P1 |

### 2.5. 청첩장 뷰 (게스트)

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| GV-01 | 페이지 로딩 | 3초 이내 렌더링 | P0 |
| GV-02 | Hero 섹션 | 대표 사진 + 이름 표시 | P0 |
| GV-03 | 날짜/시간 표시 | D-Day 카운트다운 정상 | P0 |
| GV-04 | 갤러리 | 사진 스와이프/슬라이드 | P0 |
| GV-05 | 갤러리 확대 | 탭하여 확대 보기 | P1 |
| GV-06 | 지도 표시 | 카카오맵 정상 렌더링 | P0 |
| GV-07 | 지도 → 앱 연결 | 카카오맵/네이버맵 앱 열기 | P0 |
| GV-08 | 계좌번호 복사 | 복사 버튼 동작 | P0 |
| GV-09 | 계좌번호 복사 (인앱) | fallback 안내 표시 | P0 |
| GV-10 | 전화 걸기 | tel: 링크 동작 | P1 |
| GV-11 | 카카오톡 공유 | 공유 카드 정상 표시 | P0 |
| GV-12 | URL 공유 | 링크 복사 동작 | P0 |
| GV-13 | BGM 재생 | 터치 후 재생 | P1 |
| GV-14 | BGM 토글 | 음소거/재생 전환 | P1 |

### 2.6. RSVP

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| RS-01 | RSVP 폼 표시 | 참석 여부 선택 UI | P0 |
| RS-02 | 참석 선택 | 인원 수 입력 필드 표시 | P0 |
| RS-03 | 불참 선택 | 인원 수 입력 없이 제출 | P0 |
| RS-04 | 이름 입력 | 필수 입력 검증 | P0 |
| RS-05 | 연락처 입력 (선택) | 선택 입력 | P1 |
| RS-06 | 제출 성공 | 감사 메시지 표시 | P0 |
| RS-07 | 중복 제출 방지 | 동일 기기 재제출 안내 | P1 |
| RS-08 | 오프라인 제출 | 네트워크 복구 후 재시도 안내 | P2 |

### 2.7. 방명록

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| GB-01 | 방명록 목록 표시 | 최신순 메시지 목록 | P0 |
| GB-02 | 메시지 작성 | 이름 + 내용 + 비밀번호 입력 | P0 |
| GB-03 | 메시지 등록 | 즉시 목록에 반영 | P0 |
| GB-04 | 메시지 삭제 | 비밀번호 확인 후 삭제 | P1 |
| GB-05 | 비밀번호 오류 | 삭제 실패 안내 | P1 |
| GB-06 | 욕설 필터링 | 부적절한 단어 차단 | P2 |
| GB-07 | 글자 수 제한 | 200자 초과 시 안내 | P1 |

### 2.8. 마이페이지 (대시보드)

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| MY-01 | 청첩장 현황 카드 | 발행 상태, 조회수 표시 | P0 |
| MY-02 | RSVP 현황 | 참석/불참 인원 표시 | P0 |
| MY-03 | RSVP 상세 목록 | 참석자 명단 보기 | P0 |
| MY-04 | RSVP 엑셀 다운로드 | CSV 파일 다운로드 | P1 |
| MY-05 | 방명록 관리 | 삭제 기능 | P1 |
| MY-06 | 청첩장 수정 | 에디터 이동 | P0 |
| MY-07 | 청첩장 통계 | 일별 조회수 차트 | P2 |
| MY-08 | 쿠폰 현황 | 보유 쿠폰 수 표시 | P0 |

### 2.9. 결제

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| PM-01 | 쿠폰 상품 선택 | 상품 정보 표시 | P0 |
| PM-02 | 결제 수단 선택 | 카드, 간편결제 선택 | P0 |
| PM-03 | 카드 결제 | PG 결제창 → 성공 | P0 |
| PM-04 | 카카오페이 결제 | 카카오페이 → 성공 | P0 |
| PM-05 | 네이버페이 결제 | 네이버페이 → 성공 | P1 |
| PM-06 | 결제 취소 | 결제창에서 취소 시 복귀 | P1 |
| PM-07 | 결제 실패 | 에러 안내, 재시도 가능 | P0 |
| PM-08 | 결제 완료 | 쿠폰 지급 확인 | P0 |
| PM-09 | 영수증 확인 | 결제 내역에서 영수증 보기 | P2 |

---

## 3. Non-Functional Test Checklist

### 3.1. 성능 테스트

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| PF-01 | 랜딩 LCP | < 2.5초 | P0 |
| PF-02 | 청첩장 LCP | < 2.5초 | P0 |
| PF-03 | 청첩장 FID | < 100ms | P0 |
| PF-04 | 청첩장 CLS | < 0.1 | P0 |
| PF-05 | API 응답 시간 (p95) | < 500ms | P0 |
| PF-06 | 이미지 로딩 (갤러리) | Lazy load 정상 | P1 |
| PF-07 | 많은 이미지 (30장) | 메모리 크래시 없음 | P0 |
| PF-08 | 3G 환경 로딩 | 10초 이내 기본 콘텐츠 | P1 |

### 3.2. 접근성 테스트

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| AC-01 | 색상 대비 | WCAG AA 기준 충족 | P1 |
| AC-02 | 폰트 크기 | 최소 14px 이상 | P1 |
| AC-03 | 터치 타겟 | 최소 44x44px | P0 |
| AC-04 | 이미지 alt 텍스트 | 주요 이미지 alt 존재 | P2 |
| AC-05 | 키보드 네비게이션 | Tab 키로 이동 가능 (데스크탑) | P2 |

### 3.3. 보안 테스트

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| SE-01 | HTTPS 적용 | 모든 페이지 HTTPS | P0 |
| SE-02 | XSS 방지 | 스크립트 인젝션 차단 | P0 |
| SE-03 | CSRF 방지 | 토큰 검증 | P0 |
| SE-04 | SQL Injection | 파라미터 이스케이프 | P0 |
| SE-05 | 인증 없는 접근 차단 | 마이페이지 등 로그인 필요 | P0 |
| SE-06 | Rate Limiting | 과도한 요청 차단 | P1 |
| SE-07 | 타인 청첩장 수정 차단 | 권한 검증 | P0 |

---

## 4. Device-Specific Test

### 4.1. iOS 특화 테스트

| ID | Test Case | Priority |
|----|-----------|----------|
| iOS-01 | Safari 뒤로가기 캐시 (bfcache) | P1 |
| iOS-02 | Notch/Dynamic Island 영역 | P0 |
| iOS-03 | Safe Area 적용 | P0 |
| iOS-04 | 키보드 올라올 때 레이아웃 | P0 |
| iOS-05 | Pull-to-refresh 동작 | P1 |
| iOS-06 | 스크린샷 (청첩장 공유용) | P2 |

### 4.2. Android 특화 테스트

| ID | Test Case | Priority |
|----|-----------|----------|
| AND-01 | 하드웨어 뒤로가기 버튼 | P0 |
| AND-02 | 다양한 화면 비율 (16:9, 20:9) | P0 |
| AND-03 | 시스템 폰트 크기 변경 | P1 |
| AND-04 | 다크모드 (시스템 설정) | P2 |
| AND-05 | 저사양 기기 성능 | P1 |

### 4.3. 인앱 브라우저 특화 테스트

| ID | Test Case | Browser | Priority |
|----|-----------|---------|----------|
| IAB-01 | 100vh 레이아웃 | 카카오/네이버 | P0 |
| IAB-02 | position: fixed 헤더 | 카카오/네이버 | P0 |
| IAB-03 | 클립보드 복사 | 카카오/네이버 | P0 |
| IAB-04 | 외부 브라우저 열기 | 카카오/네이버 | P1 |
| IAB-05 | 오디오 재생 | 카카오/네이버 | P1 |
| IAB-06 | 동영상 재생 | 카카오/네이버 | P1 |
| IAB-07 | 지도 앱 연결 | 카카오/네이버 | P0 |

---

## 5. Regression Test Suite

### 5.1. 핵심 플로우 (Smoke Test)

배포 전 필수 확인 항목 (5분 이내 완료)

| # | Flow | Steps |
|---|------|-------|
| 1 | 랜딩 → 로그인 | 랜딩 방문 → 카카오 로그인 → 대시보드 도착 |
| 2 | 청첩장 생성 | Quick Setup → 기본 정보 입력 → 미리보기 |
| 3 | 청첩장 발행 | 쿠폰 사용 → 발행 완료 → URL 접속 확인 |
| 4 | 게스트 뷰 | 청첩장 열람 → 갤러리 → 지도 → RSVP 제출 |
| 5 | 공유하기 | 카카오톡 공유 → 링크 수신 확인 |

### 5.2. 확장 회귀 테스트

주요 릴리스 전 전체 확인 (30분)

- 모든 P0 테스트 케이스
- 주요 P1 테스트 케이스
- 최근 수정된 기능 관련 테스트

---

## 6. Test Data

### 6.1. 테스트 계정

| Purpose | Email | Password | Note |
|---------|-------|----------|------|
| 일반 테스트 | test@yeonjeong.kr | - | 카카오 OAuth |
| 쿠폰 보유 | test-coupon@yeonjeong.kr | - | 쿠폰 5개 보유 |
| 발행 완료 | test-published@yeonjeong.kr | - | 발행된 청첩장 있음 |
| 신규 가입 | (매번 새로 생성) | - | 가입 플로우 테스트 |

### 6.2. 테스트 데이터

```yaml
# 테스트 청첩장 정보
invitation:
  groomName: "김신랑"
  brideName: "이신부"
  weddingDate: "2025-05-10"
  weddingTime: "12:00"
  venue: "서울 강남구 테헤란로 123 그랜드볼룸"
  venueHall: "그랜드볼룸 3층"

# 테스트 이미지
images:
  - valid: "/test-assets/couple-1.jpg" # 1MB
  - large: "/test-assets/large-image.jpg" # 15MB (실패 케이스)
  - invalid: "/test-assets/corrupt.jpg" # 손상된 파일

# 테스트 계좌
accounts:
  groom: "국민은행 012-345-678901 김신랑"
  bride: "신한은행 110-123-456789 이신부"
```

---

## 7. Bug Report Template

### 7.1. 버그 리포트 양식

```markdown
## Bug Title
[간결한 제목]

## Environment
- Device: [예: iPhone 15 Pro]
- OS: [예: iOS 17.2]
- Browser: [예: 카카오톡 인앱 v10.5.0]
- Network: [예: WiFi]

## Steps to Reproduce
1. [첫 번째 단계]
2. [두 번째 단계]
3. [세 번째 단계]

## Expected Result
[예상 동작]

## Actual Result
[실제 동작]

## Screenshots/Video
[스크린샷 또는 영상 첨부]

## Severity
- [ ] Critical (서비스 불가)
- [ ] High (주요 기능 장애)
- [ ] Medium (일부 기능 문제)
- [ ] Low (사소한 UI 이슈)

## Additional Context
[기타 참고 사항]
```

### 7.2. Severity 기준

| Severity | Definition | SLA |
|----------|------------|-----|
| **Critical** | 서비스 전체 장애, 데이터 손실 | 4시간 이내 |
| **High** | 핵심 기능 장애 (발행, 결제 등) | 24시간 이내 |
| **Medium** | 일부 기능 문제, 우회 가능 | 3일 이내 |
| **Low** | UI 깨짐, 오타 등 | 다음 릴리스 |

---

## 8. Test Schedule

### 8.1. 테스트 주기

| Type | Frequency | Owner |
|------|-----------|-------|
| Smoke Test | 모든 배포 전 | Dev/QA |
| 회귀 테스트 | 주 1회 (금요일) | QA |
| 전체 테스트 | 메이저 릴리스 전 | QA |
| 인앱 브라우저 테스트 | 앱 업데이트 시 | QA |
| 성능 테스트 | 월 1회 | Dev |
| 보안 테스트 | 분기 1회 | Security |

### 8.2. 릴리스 체크리스트

```markdown
## Pre-Release Checklist

### 배포 전 필수
- [ ] 모든 P0 테스트 통과
- [ ] Smoke Test 통과
- [ ] lsp_diagnostics 에러 없음
- [ ] Build 성공
- [ ] Staging 환경 테스트 완료

### 배포 후 확인
- [ ] Production Health Check 정상
- [ ] Sentry 에러 모니터링 (30분)
- [ ] 주요 플로우 수동 테스트
- [ ] 성능 지표 확인 (Vercel Analytics)

### 롤백 기준
- [ ] P0 버그 발견 시 즉시 롤백
- [ ] 에러율 5% 초과 시 롤백
- [ ] 응답 시간 p95 > 3초 지속 시 롤백
```

---

## 9. Automation (Future)

### 9.1. E2E 테스트 계획

```typescript
// 향후 Playwright 도입 예정
// tests/e2e/smoke.spec.ts

test.describe("Smoke Test", () => {
  test("랜딩 페이지 로딩", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("로그인 플로우", async ({ page }) => {
    await page.goto("/login");
    // OAuth mock 필요
  });

  test("청첩장 조회", async ({ page }) => {
    await page.goto("/test-invitation");
    await expect(page.locator(".hero-section")).toBeVisible();
  });
});
```

### 9.2. Visual Regression 계획

```typescript
// Percy 또는 Chromatic 도입 예정
// 주요 컴포넌트 스냅샷 테스트

test("청첩장 Hero 섹션 스냅샷", async ({ page }) => {
  await page.goto("/test-invitation");
  await percySnapshot(page, "Invitation Hero");
});
```

---

## 10. Test Environment Setup

### 10.1. 로컬 테스트 환경

```bash
# 테스트 환경 실행
npm run dev

# 테스트 DB (로컬)
docker-compose up -d postgres

# 테스트 데이터 시드
npm run db:seed:test
```

### 10.2. Staging 환경

| Item | Value |
|------|-------|
| URL | https://staging.yeonjeong.kr |
| DB | Neon staging branch |
| 결제 | PG 테스트 모드 |
| 카카오 | 개발용 앱 키 |
