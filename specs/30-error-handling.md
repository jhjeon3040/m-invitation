# Error Handling Strategy Specification

## Overview

"연정" 서비스의 에러 핸들링 전략입니다.
사용자 친화적인 에러 메시지와 복구 방법을 제공합니다.

---

## 에러 분류

| 카테고리 | 설명 | HTTP 코드 | 사용자 복구 가능 |
|----------|------|-----------|-----------------|
| **Client Error** | 잘못된 입력, 인증 실패 | 4xx | ✅ |
| **Server Error** | 서버 장애, 내부 오류 | 5xx | ❌ |
| **Network Error** | 연결 실패, 타임아웃 | - | ⚠️ 재시도 |
| **Validation Error** | 폼 유효성 검사 실패 | 400/422 | ✅ |
| **Business Error** | 비즈니스 로직 위반 | 400/409 | ✅ |

---

## 1. 에러 응답 형식

### 1.1. 표준 에러 응답

```typescript
interface ErrorResponse {
  error: {
    code: string;           // 에러 코드 (기계 판독용)
    message: string;        // 사용자 메시지 (한글)
    details?: {             // 상세 정보 (선택)
      field?: string;       // 오류 필드
      reason?: string;      // 상세 사유
      suggestion?: string;  // 해결 제안
    };
    requestId?: string;     // 추적용 ID
    timestamp: string;      // ISO 8601
  };
}
```

### 1.2. 에러 응답 예시

```json
{
  "error": {
    "code": "INVITATION_NOT_FOUND",
    "message": "청첩장을 찾을 수 없습니다.",
    "details": {
      "reason": "삭제되었거나 잘못된 주소입니다.",
      "suggestion": "주소를 다시 확인해주세요."
    },
    "requestId": "req_abc123",
    "timestamp": "2025-01-08T12:00:00Z"
  }
}
```

---

## 2. 에러 코드 체계

### 2.1. 코드 네이밍 규칙

```
{DOMAIN}_{ACTION}_{REASON}

예시:
- AUTH_LOGIN_INVALID_CREDENTIALS
- INVITATION_CREATE_QUOTA_EXCEEDED
- RSVP_SUBMIT_ALREADY_SUBMITTED
- IMAGE_UPLOAD_FILE_TOO_LARGE
```

### 2.2. 도메인별 에러 코드

#### 인증 (AUTH)

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `AUTH_UNAUTHORIZED` | 401 | 로그인이 필요합니다. | 로그인 페이지로 이동 |
| `AUTH_TOKEN_EXPIRED` | 401 | 세션이 만료되었습니다. | 다시 로그인 |
| `AUTH_TOKEN_INVALID` | 401 | 인증 정보가 올바르지 않습니다. | 다시 로그인 |
| `AUTH_FORBIDDEN` | 403 | 접근 권한이 없습니다. | - |
| `AUTH_OAUTH_FAILED` | 400 | 소셜 로그인에 실패했습니다. | 다시 시도 |

#### 청첩장 (INVITATION)

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `INVITATION_NOT_FOUND` | 404 | 청첩장을 찾을 수 없습니다. | 주소 확인 |
| `INVITATION_SLUG_TAKEN` | 409 | 이미 사용 중인 주소입니다. | 다른 주소 입력 |
| `INVITATION_QUOTA_EXCEEDED` | 403 | 청첩장 생성 한도를 초과했습니다. | 쿠폰 구매 |
| `INVITATION_NOT_PUBLISHED` | 403 | 아직 공개되지 않은 청첩장입니다. | - |
| `INVITATION_EXPIRED` | 410 | 만료된 청첩장입니다. | - |

#### 이미지 (IMAGE)

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `IMAGE_FILE_TOO_LARGE` | 413 | 파일 크기가 너무 큽니다. (최대 10MB) | 파일 압축 |
| `IMAGE_INVALID_FORMAT` | 400 | 지원하지 않는 파일 형식입니다. | JPG/PNG/WEBP 사용 |
| `IMAGE_UPLOAD_FAILED` | 500 | 이미지 업로드에 실패했습니다. | 다시 시도 |
| `IMAGE_QUOTA_EXCEEDED` | 403 | 이미지 저장 공간을 초과했습니다. | 기존 이미지 삭제 |

#### RSVP

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `RSVP_ALREADY_SUBMITTED` | 409 | 이미 참석 여부를 제출하셨습니다. | 수정 필요시 연락 |
| `RSVP_DEADLINE_PASSED` | 400 | 참석 여부 제출 기한이 지났습니다. | - |
| `RSVP_INVALID_DATA` | 400 | 입력 정보를 확인해주세요. | 필드 확인 |

#### 쿠폰 (COUPON)

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `COUPON_NOT_FOUND` | 404 | 존재하지 않는 쿠폰 코드입니다. | 코드 확인 |
| `COUPON_ALREADY_USED` | 409 | 이미 사용된 쿠폰입니다. | - |
| `COUPON_EXPIRED` | 410 | 유효 기간이 만료된 쿠폰입니다. | 새 쿠폰 구매 |

#### 시스템 (SYSTEM)

| 코드 | HTTP | 메시지 | 해결 방법 |
|------|------|--------|----------|
| `SYSTEM_INTERNAL_ERROR` | 500 | 일시적인 오류가 발생했습니다. | 잠시 후 다시 시도 |
| `SYSTEM_MAINTENANCE` | 503 | 서비스 점검 중입니다. | 점검 완료 후 이용 |
| `SYSTEM_RATE_LIMITED` | 429 | 요청이 너무 많습니다. | 잠시 후 다시 시도 |

---

## 3. 클라이언트 에러 처리

### 3.1. API 에러 훅

```typescript
// hooks/useApiError.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ApiError {
  code: string;
  message: string;
  details?: {
    field?: string;
    suggestion?: string;
  };
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    // API 에러 응답인 경우
    if (isApiError(err)) {
      setError(err.error);
      
      // 에러 코드별 특수 처리
      switch (err.error.code) {
        case 'AUTH_UNAUTHORIZED':
        case 'AUTH_TOKEN_EXPIRED':
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          break;
          
        case 'SYSTEM_MAINTENANCE':
          // 점검 페이지로 리다이렉트
          window.location.href = '/maintenance';
          break;
          
        default:
          // 토스트 메시지 표시
          toast.error(err.error.message, {
            description: err.error.details?.suggestion,
          });
      }
      
      return;
    }

    // 네트워크 에러
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      setError({
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.',
      });
      toast.error('네트워크 연결을 확인해주세요.');
      return;
    }

    // 알 수 없는 에러
    setError({
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
    });
    toast.error('알 수 없는 오류가 발생했습니다.');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}

function isApiError(err: unknown): err is { error: ApiError } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'error' in err &&
    typeof (err as { error: unknown }).error === 'object'
  );
}
```

### 3.2. React Error Boundary

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 서비스로 전송
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-6xl mb-4">😢</div>
      <h1 className="text-xl font-semibold mb-2">
        문제가 발생했습니다
      </h1>
      <p className="text-gray-600 mb-4 text-center">
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-500 text-white rounded-lg"
      >
        새로고침
      </button>
    </div>
  );
}
```

### 3.3. 페이지별 Error Boundary

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary
          fallback={<GlobalErrorPage />}
          onError={(error) => {
            // Sentry 등으로 에러 전송
            captureException(error);
          }}
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

// app/error.tsx (Next.js App Router)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">문제가 발생했습니다</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-pink-500 text-white rounded-lg"
      >
        다시 시도
      </button>
    </div>
  );
}
```

---

## 4. 폼 유효성 검사 에러

### 4.1. 클라이언트 유효성 검사

```typescript
// lib/validation.ts
import { z } from 'zod';

export const rsvpSchema = z.object({
  attendance: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: '참석 여부를 선택해주세요.' }),
  }),
  guestCount: z
    .number({ invalid_type_error: '숫자를 입력해주세요.' })
    .min(1, '최소 1명 이상이어야 합니다.')
    .max(10, '최대 10명까지 가능합니다.'),
  name: z
    .string()
    .min(2, '이름은 2글자 이상 입력해주세요.')
    .max(20, '이름은 20글자 이하로 입력해주세요.'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다.')
    .optional(),
  side: z.enum(['groom', 'bride'], {
    errorMap: () => ({ message: '신랑/신부 측을 선택해주세요.' }),
  }),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;
```

### 4.2. 폼 에러 표시

```tsx
// components/FormField.tsx
interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, name, error, required, children }: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p 
          id={errorId} 
          role="alert" 
          className="mt-1 text-sm text-red-500 flex items-center"
        >
          <span aria-hidden="true" className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
```

### 4.3. React Hook Form 통합

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function RsvpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
  });

  const onSubmit = async (data: RsvpFormData) => {
    try {
      await submitRsvp(data);
      toast.success('참석 여부가 등록되었습니다.');
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="성함" name="name" error={errors.name?.message} required>
        <input
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
      </FormField>
      
      {/* ... 다른 필드 */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '제출 중...' : '제출하기'}
      </button>
    </form>
  );
}
```

---

## 5. 네트워크 에러 처리

### 5.1. 재시도 로직

```typescript
// lib/fetch.ts
interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response;
    } catch (err) {
      lastError = err as Error;

      // AbortError (타임아웃) 또는 마지막 시도면 즉시 throw
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }

      if (attempt === retries) {
        throw lastError;
      }

      // 재시도 전 대기 (지수 백오프)
      await new Promise((resolve) => 
        setTimeout(resolve, retryDelay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError;
}
```

### 5.2. 오프라인 감지

```tsx
// hooks/useOnlineStatus.ts
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// 오프라인 배너 컴포넌트
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="alert" 
      className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50"
    >
      📡 오프라인 상태입니다. 인터넷 연결을 확인해주세요.
    </div>
  );
}
```

---

## 6. 에러 페이지

### 6.1. 404 Not Found

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-2xl font-semibold mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="flex gap-4">
        <a
          href="/"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          홈으로 이동
        </a>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
```

### 6.2. 청첩장 Not Found

```tsx
// app/[slug]/not-found.tsx
export default function InvitationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="text-8xl mb-4">💌</div>
      <h1 className="text-2xl font-semibold mb-2">
        청첩장을 찾을 수 없습니다
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        주소가 잘못되었거나 삭제된 청첩장입니다.
        <br />
        링크를 다시 확인해주세요.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-pink-500 text-white rounded-full"
      >
        연정 홈으로
      </a>
    </div>
  );
}
```

### 6.3. 점검 페이지

```tsx
// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-8xl mb-4">🔧</div>
      <h1 className="text-2xl font-semibold mb-2">
        서비스 점검 중입니다
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        더 나은 서비스를 위해 점검 중입니다.
        <br />
        빠른 시간 내에 정상화하겠습니다.
      </p>
      <div className="text-sm text-gray-500">
        예상 완료 시간: 2025년 1월 8일 오전 6시
      </div>
    </div>
  );
}
```

---

## 7. 에러 로깅 및 모니터링

### 7.1. Sentry 통합

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    
    beforeSend(event) {
      // 민감한 정보 필터링
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
      }
      return event;
    },
  });
}

export function captureApiError(error: ApiError, context?: Record<string, unknown>) {
  Sentry.captureException(new Error(error.code), {
    tags: {
      errorCode: error.code,
    },
    extra: {
      message: error.message,
      details: error.details,
      ...context,
    },
  });
}
```

### 7.2. 에러 추적 ID

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(request: Request) {
  const requestId = nanoid(10);
  
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}

// API 에러 응답에 requestId 포함
export function createErrorResponse(code: string, message: string, requestId: string) {
  return NextResponse.json({
    error: {
      code,
      message,
      requestId, // 사용자가 문의 시 제공
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

## 8. 사용자 친화적 에러 메시지 가이드

### 8.1. 메시지 작성 원칙

| 원칙 | 설명 | 예시 |
|------|------|------|
| **명확하게** | 무엇이 잘못되었는지 | "로그인이 필요합니다" |
| **친절하게** | 비난하지 않기 | ❌ "잘못된 입력" → ✅ "확인이 필요해요" |
| **해결책 제시** | 다음 행동 안내 | "다시 로그인해주세요" |
| **기술 용어 지양** | 일반인도 이해 | ❌ "500 Internal Server Error" |

### 8.2. 메시지 예시

```typescript
const ERROR_MESSAGES: Record<string, { message: string; suggestion?: string }> = {
  AUTH_UNAUTHORIZED: {
    message: '로그인이 필요합니다.',
    suggestion: '로그인 후 다시 시도해주세요.',
  },
  AUTH_TOKEN_EXPIRED: {
    message: '세션이 만료되었습니다.',
    suggestion: '다시 로그인해주세요.',
  },
  INVITATION_NOT_FOUND: {
    message: '청첩장을 찾을 수 없습니다.',
    suggestion: '주소가 맞는지 확인해주세요.',
  },
  IMAGE_FILE_TOO_LARGE: {
    message: '이미지 크기가 너무 큽니다.',
    suggestion: '10MB 이하의 파일을 선택해주세요.',
  },
  SYSTEM_INTERNAL_ERROR: {
    message: '일시적인 오류가 발생했습니다.',
    suggestion: '잠시 후 다시 시도해주세요.',
  },
  NETWORK_ERROR: {
    message: '네트워크 연결에 문제가 있습니다.',
    suggestion: '인터넷 연결을 확인해주세요.',
  },
};
```
