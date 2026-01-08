# Accessibility (a11y) Specification

## Overview

"연정" 서비스의 웹 접근성 스펙입니다.
WCAG 2.1 AA 수준을 목표로 하며, 모든 사용자가 청첩장을 제작하고 열람할 수 있도록 합니다.

---

## 접근성 목표

| 레벨 | 설명 | 목표 |
|------|------|------|
| WCAG 2.1 A | 최소 접근성 | ✅ 필수 |
| WCAG 2.1 AA | 권장 접근성 | ✅ 목표 |
| WCAG 2.1 AAA | 향상된 접근성 | ⭕ 부분 적용 |

---

## 1. 인식의 용이성 (Perceivable)

### 1.1. 텍스트 대체

#### 이미지 대체 텍스트

```tsx
// ✅ 좋은 예
<Image
  src={couplPhoto}
  alt="민영과 지훈의 웨딩 사진 - 벚꽃 아래에서 손을 잡고 있는 모습"
/>

// ❌ 나쁜 예
<Image src={photo} alt="사진" />
<Image src={photo} alt="" /> // 장식용이 아닌 경우
```

#### 장식용 이미지

```tsx
// 장식용 이미지는 빈 alt 또는 role="presentation"
<Image src={decorativeBorder} alt="" role="presentation" />
```

#### 아이콘 버튼

```tsx
// ✅ 아이콘만 있는 버튼
<button aria-label="청첩장 공유하기">
  <ShareIcon aria-hidden="true" />
</button>

// ✅ 텍스트와 아이콘이 함께 있는 경우
<button>
  <ShareIcon aria-hidden="true" />
  <span>공유</span>
</button>
```

### 1.2. 색상 대비

#### 최소 대비율

| 요소 | WCAG AA | WCAG AAA |
|------|---------|----------|
| 일반 텍스트 (< 18pt) | 4.5:1 | 7:1 |
| 큰 텍스트 (≥ 18pt bold) | 3:1 | 4.5:1 |
| UI 컴포넌트, 그래픽 | 3:1 | - |

#### 색상 팔레트 대비 검증

```typescript
// 디자인 시스템 색상 대비 검증
const colorContrast = {
  // 배경: #FFFBF5 (크림)
  textPrimary: "#2C2C2C",     // 대비율 12.5:1 ✅
  textSecondary: "#5A5A5A",   // 대비율 6.2:1 ✅
  textMuted: "#8A7A6A",       // 대비율 4.1:1 ⚠️ (큰 텍스트만)
  accent: "#E91E63",          // 대비율 4.6:1 ✅
  
  // 배경: #E91E63 (핑크 버튼)
  buttonText: "#FFFFFF",      // 대비율 4.6:1 ✅
};
```

#### 색상만으로 정보 전달 금지

```tsx
// ❌ 나쁜 예: 색상만으로 상태 표시
<div className={isError ? "text-red-500" : "text-green-500"}>
  {message}
</div>

// ✅ 좋은 예: 아이콘 + 텍스트 + 색상
<div className={isError ? "text-red-500" : "text-green-500"}>
  {isError ? "❌ " : "✅ "}
  {message}
</div>
```

### 1.3. 텍스트 크기 조절

```css
/* rem 단위 사용으로 브라우저 설정 존중 */
html {
  font-size: 100%; /* 사용자 설정 존중 */
}

body {
  font-size: 1rem;    /* 16px 기준 */
  line-height: 1.5;
}

h1 { font-size: 2rem; }    /* 32px */
h2 { font-size: 1.5rem; }  /* 24px */
p  { font-size: 1rem; }    /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

### 1.4. 콘텐츠 리플로우

```css
/* 400% 확대에서도 가로 스크롤 없이 사용 가능 */
.container {
  max-width: 100%;
  overflow-wrap: break-word;
}

/* 반응형 레이아웃 */
@media (max-width: 320px) {
  /* 최소 320px 너비 지원 */
}
```

---

## 2. 운용의 용이성 (Operable)

### 2.1. 키보드 접근성

#### 모든 기능 키보드로 접근 가능

```tsx
// 키보드 포커스 가능한 요소
<button>...</button>  // ✅ 기본 지원
<a href="...">...</a> // ✅ 기본 지원
<input />             // ✅ 기본 지원

// 커스텀 인터랙티브 요소
<div 
  role="button" 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  클릭 가능한 영역
</div>
```

#### 포커스 순서

```tsx
// DOM 순서대로 논리적인 포커스 이동
// 필요시 tabIndex로 조정 (가급적 피함)

// Skip to content 링크
<a href="#main-content" className="sr-only focus:not-sr-only">
  본문으로 바로가기
</a>
```

#### 포커스 표시

```css
/* 포커스 링 항상 표시 (outline 제거 금지) */
:focus {
  outline: 2px solid #E91E63;
  outline-offset: 2px;
}

/* 마우스 클릭 시에만 숨기기 */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #E91E63;
  outline-offset: 2px;
}
```

#### 키보드 트랩 방지

```tsx
// 모달에서 포커스 트랩 (의도적)
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

### 2.2. 충분한 시간

#### 자동 슬라이드/캐러셀

```tsx
// 자동 슬라이드는 일시정지 가능해야 함
function Gallery() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <button 
        aria-label={isPaused ? "슬라이드쇼 재생" : "슬라이드쇼 일시정지"}
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "▶" : "❚❚"}
      </button>
      {/* 슬라이드 콘텐츠 */}
    </div>
  );
}
```

#### 세션 타임아웃

```tsx
// 세션 만료 전 경고 및 연장 옵션
function SessionWarning({ expiresIn, onExtend }) {
  return (
    <div role="alert" aria-live="assertive">
      <p>세션이 {expiresIn}초 후 만료됩니다.</p>
      <button onClick={onExtend}>세션 연장</button>
    </div>
  );
}
```

### 2.3. 발작 유발 콘텐츠 금지

```tsx
// 초당 3회 이상 깜빡이는 콘텐츠 금지
// 애니메이션 속도 제한

const animation = {
  // ❌ 위험: 빠른 깜빡임
  // animation: "blink 0.1s infinite"
  
  // ✅ 안전: 부드러운 전환
  transition: "opacity 0.3s ease-in-out"
};

// 모션 감소 설정 존중
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  // 애니메이션 비활성화 또는 간소화
}
```

### 2.4. 터치 타겟 크기

```css
/* 최소 터치 타겟: 44x44px (WCAG), 48x48px (권장) */
button, 
a,
[role="button"] {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* 인접한 타겟 간 간격 */
.button-group > * + * {
  margin-left: 8px; /* 최소 8px 간격 */
}
```

---

## 3. 이해의 용이성 (Understandable)

### 3.1. 언어 설정

```html
<html lang="ko">
  <!-- ... -->
  <p>안녕하세요</p>
  <p lang="en">Hello</p> <!-- 다른 언어 구간 명시 -->
</html>
```

### 3.2. 일관된 네비게이션

```tsx
// 모든 페이지에서 동일한 위치의 네비게이션
<header>
  <nav aria-label="주 메뉴">
    {/* 일관된 메뉴 순서 */}
  </nav>
</header>

<main id="main-content">
  {/* 페이지 콘텐츠 */}
</main>

<footer>
  <nav aria-label="푸터 메뉴">
    {/* ... */}
  </nav>
</footer>
```

### 3.3. 입력 오류 처리

```tsx
// 오류 식별 + 설명 + 수정 제안
function FormField({ error, ...props }) {
  const errorId = `${props.id}-error`;

  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500">
          ❌ {error}
        </p>
      )}
    </div>
  );
}

// 사용 예
<FormField
  id="phone"
  label="연락처"
  error="연락처는 010-0000-0000 형식으로 입력해주세요."
/>
```

### 3.4. 레이블 및 지시문

```tsx
// 모든 입력 필드에 레이블
<label htmlFor="guestName">성함 *</label>
<input 
  id="guestName" 
  required 
  aria-required="true"
  placeholder="홍길동" // placeholder는 레이블 대체 불가
/>

// 입력 형식 안내
<label htmlFor="phone">연락처</label>
<input 
  id="phone" 
  type="tel"
  aria-describedby="phone-hint"
/>
<p id="phone-hint" className="text-sm text-gray-500">
  예: 010-1234-5678
</p>
```

---

## 4. 견고성 (Robust)

### 4.1. 유효한 HTML

```tsx
// 중첩 규칙 준수
// ❌ <p><div>...</div></p>
// ✅ <div><p>...</p></div>

// 고유한 ID
// ❌ 동일 페이지에 같은 id 중복
// ✅ 모든 id 고유하게

// ARIA 역할과 속성 올바르게 사용
```

### 4.2. ARIA 사용 원칙

```tsx
// 1. 네이티브 HTML 우선
// ❌
<div role="button" tabIndex={0} onClick={...}>버튼</div>
// ✅
<button onClick={...}>버튼</button>

// 2. 의미 변경 금지
// ❌
<h1 role="button">제목이자 버튼</h1>
// ✅
<h1>제목</h1>
<button>버튼</button>

// 3. 모든 인터랙티브 요소는 키보드 접근 가능
// 4. focusable 요소에 role="presentation" 금지
// 5. 모든 인터랙티브 요소에 접근 가능한 이름 제공
```

### 4.3. 동적 콘텐츠 알림

```tsx
// 실시간 업데이트 알림
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// 중요한 알림 (즉시)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// 로딩 상태
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? "불러오는 중..." : content}
</div>
```

---

## 5. 컴포넌트별 접근성 가이드

### 5.1. 모달/다이얼로그

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">제목</h2>
  <p id="modal-description">설명</p>
  <button aria-label="닫기">✕</button>
</div>
```

### 5.2. 탭

```tsx
<div role="tablist" aria-label="청첩장 섹션">
  <button
    role="tab"
    aria-selected={activeTab === 0}
    aria-controls="panel-0"
    id="tab-0"
  >
    인사말
  </button>
  {/* ... */}
</div>

<div
  role="tabpanel"
  id="panel-0"
  aria-labelledby="tab-0"
  hidden={activeTab !== 0}
>
  {/* 탭 콘텐츠 */}
</div>
```

### 5.3. 아코디언

```tsx
<div>
  <h3>
    <button
      aria-expanded={isOpen}
      aria-controls="accordion-content"
      id="accordion-header"
    >
      {title}
      <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
    </button>
  </h3>
  <div
    id="accordion-content"
    role="region"
    aria-labelledby="accordion-header"
    hidden={!isOpen}
  >
    {content}
  </div>
</div>
```

### 5.4. 이미지 갤러리

```tsx
<div role="region" aria-label="웨딩 사진 갤러리">
  <ul role="list">
    {images.map((img, i) => (
      <li key={i}>
        <button
          aria-label={`사진 ${i + 1} 확대보기: ${img.description}`}
          onClick={() => openLightbox(i)}
        >
          <Image src={img.src} alt={img.description} />
        </button>
      </li>
    ))}
  </ul>
  
  <div aria-live="polite">
    {images.length}개의 사진 중 {currentIndex + 1}번째
  </div>
</div>
```

### 5.5. 폼 (RSVP)

```tsx
<form aria-labelledby="rsvp-title">
  <h2 id="rsvp-title">참석 여부 알려주세요</h2>
  
  <fieldset>
    <legend>참석 의사 *</legend>
    <label>
      <input type="radio" name="attendance" value="yes" required />
      참석합니다
    </label>
    <label>
      <input type="radio" name="attendance" value="no" />
      참석이 어렵습니다
    </label>
  </fieldset>

  <div>
    <label htmlFor="guestCount">동반 인원</label>
    <input
      type="number"
      id="guestCount"
      min="0"
      max="10"
      aria-describedby="guestCount-hint"
    />
    <p id="guestCount-hint">본인 포함 인원을 입력해주세요</p>
  </div>

  <button type="submit">제출하기</button>
</form>
```

---

## 6. 스크린 리더 테스트

### 6.1. 테스트 도구

| 도구 | 플랫폼 | 용도 |
|------|--------|------|
| **VoiceOver** | macOS, iOS | 기본 스크린 리더 |
| **NVDA** | Windows | 무료 스크린 리더 |
| **TalkBack** | Android | 기본 스크린 리더 |
| **JAWS** | Windows | 상용 스크린 리더 |

### 6.2. 테스트 체크리스트

| 항목 | 확인 사항 |
|------|----------|
| 페이지 제목 | 각 페이지별 고유한 제목 읽힘 |
| 헤딩 구조 | h1 → h2 → h3 논리적 순서 |
| 링크 텍스트 | "여기를 클릭" 대신 의미 있는 텍스트 |
| 이미지 | 대체 텍스트 읽힘 |
| 폼 필드 | 레이블과 연결되어 읽힘 |
| 오류 메시지 | 자동으로 알림 |
| 동적 콘텐츠 | 변경 시 알림 |

### 6.3. 스크린 리더 전용 텍스트

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 7. 자동화 테스트

### 7.1. ESLint 플러그인

```json
// .eslintrc.json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}
```

### 7.2. axe-core 통합

```typescript
// tests/a11y.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('접근성 테스트', () => {
  it('랜딩 페이지에 접근성 위반이 없어야 함', async () => {
    const { container } = render(<LandingPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 7.3. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    configPath: './lighthouserc.json'
    
# lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 8. 접근성 선언문

```markdown
# 웹 접근성 정책

"연정"은 모든 사용자가 서비스를 이용할 수 있도록 
웹 접근성 향상을 위해 노력하고 있습니다.

## 준수 수준
- WCAG 2.1 AA 수준 준수를 목표로 합니다.

## 테스트 환경
- VoiceOver (macOS, iOS)
- TalkBack (Android)
- 키보드 전용 네비게이션

## 알려진 제한사항
- 가로 스크롤 여정 테마는 스크린 리더에서 
  일부 시각적 효과를 경험하기 어려울 수 있습니다.
- 이 경우 세로 스크롤 테마를 권장합니다.

## 피드백
접근성 관련 문의나 개선 제안:
- 이메일: accessibility@yeonjeong.kr
- 전화: 1588-0000

마지막 검토: 2025년 1월
```
