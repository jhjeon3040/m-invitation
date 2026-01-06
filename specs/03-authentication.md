# Authentication Specification (Supabase)

## Overview

"연정" 서비스의 인증 시스템 스펙입니다.
**Supabase Auth**를 사용하여 소셜 로그인을 구현합니다.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Auth Provider | Supabase Auth |
| OAuth Providers | 카카오, 네이버 |
| Session | Supabase 자동 관리 (JWT) |
| Database | Supabase PostgreSQL |

## Supported Providers

| Provider | Priority | Use Case |
|----------|----------|----------|
| **카카오** | Primary | 국내 사용자 대부분, 카카오톡 공유 연동 |
| **네이버** | Secondary | 카카오 미사용 사용자 대안 |

---

## Supabase Configuration

### Provider Setup (Supabase Dashboard)

#### 카카오 설정
```
Authentication > Providers > Kakao

- Client ID: {KAKAO_CLIENT_ID}
- Client Secret: {KAKAO_CLIENT_SECRET}
- Redirect URL: https://[project-ref].supabase.co/auth/v1/callback
```

#### 네이버 설정
```
Authentication > Providers > Custom (OIDC)

- Provider Name: naver
- Client ID: {NAVER_CLIENT_ID}
- Client Secret: {NAVER_CLIENT_SECRET}
- Issuer URL: https://nid.naver.com
- Redirect URL: https://[project-ref].supabase.co/auth/v1/callback
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only
```

---

## Authentication Flow

### Login Flow
```
[랜딩 페이지]
     ↓
[시작하기] 클릭
     ↓
[로그인 모달] - 카카오/네이버 선택
     ↓
supabase.auth.signInWithOAuth({ provider })
     ↓
[OAuth Provider 리다이렉트]
     ↓
[Supabase Callback 자동 처리]
     ↓
[Dashboard 리다이렉트]
```

### Implementation

#### Supabase Client Setup
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

#### Login Functions
```typescript
// lib/auth.ts
import { createClient } from '@/lib/supabase/client';

export async function signInWithKakao() {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // 카카오 추가 스코프
        scope: 'profile_nickname profile_image account_email',
      },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithNaver() {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'naver' as any,  // Custom OIDC
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
```

#### Auth Callback Route
```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

---

## Session Management

### Middleware (Route Protection)
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ['/dashboard', '/editor'];
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect logged-in users away from login
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*', '/login'],
};
```

### Get Current User
```typescript
// Server Component
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>Welcome, {user?.user_metadata.name}</div>;
}
```

```typescript
// Client Component
'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

---

## Database Schema (Supabase)

### Users Table (Auto-managed by Supabase Auth)
```sql
-- auth.users (Supabase 자동 관리)
-- id, email, created_at, etc.
```

### User Profiles Table (Custom)
```sql
-- public.profiles
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  avatar_url text,
  provider text,  -- 'kakao' | 'naver'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 정책
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

### Auto Profile Creation (Trigger)
```sql
-- 회원가입 시 자동으로 profiles 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## UI Components

### Login Modal
```typescript
// components/auth/LoginModal.tsx
'use client';

import { signInWithKakao, signInWithNaver } from '@/lib/auth';

export function LoginModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleKakao = async () => {
    setLoading('kakao');
    await signInWithKakao();
  };

  const handleNaver = async () => {
    setLoading('naver');
    await signInWithNaver();
  };

  return (
    <div className="modal">
      <h2>연정 시작하기</h2>
      
      <button 
        onClick={handleKakao}
        disabled={!!loading}
        className="btn-kakao"
      >
        {loading === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
      </button>
      
      <button 
        onClick={handleNaver}
        disabled={!!loading}
        className="btn-naver"
      >
        {loading === 'naver' ? '로그인 중...' : '네이버로 시작하기'}
      </button>
      
      <p className="terms">
        시작하면 <a href="/terms">이용약관</a> 및 
        <a href="/privacy">개인정보처리방침</a>에 동의하게 됩니다.
      </p>
    </div>
  );
}
```

### Button Styles
```css
.btn-kakao {
  background: #FEE500;
  color: #000000;
}

.btn-naver {
  background: #03C75A;
  color: #FFFFFF;
}
```

---

## Error Handling

### Error Messages
```typescript
const authErrors: Record<string, string> = {
  'auth/invalid-credentials': '로그인 정보가 올바르지 않습니다.',
  'auth/user-not-found': '존재하지 않는 계정입니다.',
  'auth/popup-closed': '로그인이 취소되었습니다.',
  'auth/network-error': '네트워크 오류가 발생했습니다.',
  'default': '로그인에 실패했습니다. 다시 시도해주세요.',
};

export function getAuthErrorMessage(error: any): string {
  return authErrors[error?.code] || authErrors.default;
}
```

---

## Account Management

### Profile Update
```typescript
async function updateProfile(name: string, avatarUrl?: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({ name, avatar_url: avatarUrl, updated_at: new Date() })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);
    
  if (error) throw error;
}
```

### Account Deletion
```typescript
async function deleteAccount() {
  const supabase = createClient();
  
  // 1. 관련 데이터 삭제 (또는 익명화)
  // CASCADE로 설정되어 있으면 자동 처리
  
  // 2. Supabase Auth 계정 삭제 (Server-side, service role 필요)
  // API 호출로 처리
  await fetch('/api/user/delete', { method: 'DELETE' });
}
```

```typescript
// app/api/user/delete/route.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin API로 사용자 삭제
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

---

## Security Considerations

### Row Level Security (RLS)
모든 테이블에 RLS 활성화 필수:
```sql
-- 예: invitations 테이블
alter table public.invitations enable row level security;

-- 본인 청첩장만 조회
create policy "Users can view own invitations"
  on public.invitations for select
  using (auth.uid() = user_id);

-- 본인 청첩장만 수정
create policy "Users can update own invitations"
  on public.invitations for update
  using (auth.uid() = user_id);

-- 본인만 생성
create policy "Users can create own invitations"
  on public.invitations for insert
  with check (auth.uid() = user_id);

-- 본인 청첩장만 삭제
create policy "Users can delete own invitations"
  on public.invitations for delete
  using (auth.uid() = user_id);
```

### Public Access (발행된 청첩장)
```sql
-- 발행된 청첩장은 누구나 조회 가능
create policy "Anyone can view published invitations"
  on public.invitations for select
  using (status = 'published');
```

---

## Migration from Custom Auth

Supabase 도입으로 불필요해진 항목:
- ~~JWT 직접 생성/검증~~
- ~~Refresh token 로직~~
- ~~OAuth callback 직접 구현~~
- ~~세션 테이블 관리~~
- ~~Rate limiting for auth~~ (Supabase 내장)
