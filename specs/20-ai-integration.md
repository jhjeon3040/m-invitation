# AI Integration Specification

## Overview

"연정" 서비스의 AI 기능 통합 스펙입니다.
OpenAI API를 활용하여 감성적인 초대글을 자동 생성합니다.

---

## 1. AI Features

### 1.1. 기능 목록

| Feature | Description | API | Priority |
|---------|-------------|-----|----------|
| **AI 초대글** | 키워드 기반 초대 문구 생성 | GPT-4o-mini | MVP |
| **문구 다듬기** | 기존 문구 개선 제안 | GPT-4o-mini | MVP |
| **이미지 설명** | 갤러리 이미지 alt 텍스트 | GPT-4o | 추후 |

### 1.2. 미포함 기능 (의도적 제외)

| Feature | 제외 이유 |
|---------|----------|
| 이미지 생성 | 웨딩 사진은 실제 사진 사용 필수 |
| 디자인 추천 | 테마 선택으로 충분 |
| 챗봇 | CS는 카카오톡 채널로 |

---

## 2. AI 초대글 생성

### 2.1. User Flow

```
[초대글 작성 섹션]
      ↓
[✨ AI로 작성하기] 버튼 클릭
      ↓
┌─────────────────────────────────────────┐
│ AI 초대글 생성                           │
├─────────────────────────────────────────┤
│                                         │
│ 몇 가지만 알려주세요                      │
│                                         │
│ 어떻게 만나셨나요? *                      │
│ [소개팅  ▼]                              │
│                                         │
│ 어떤 분위기로 작성할까요? *               │
│ [따뜻한  ▼]                              │
│                                         │
│ 특별히 넣고 싶은 키워드 (선택)            │
│ [5년, 대학동기, 캠퍼스커플              ] │
│                                         │
│         [초대글 만들기]                   │
│                                         │
└─────────────────────────────────────────┘
      ↓
[로딩 - "마음을 담은 글을 쓰고 있어요..."]
      ↓
┌─────────────────────────────────────────┐
│ 3가지 초대글을 준비했어요                  │
├─────────────────────────────────────────┤
│                                         │
│ [1] ────────────────────────────────    │
│ 캠퍼스의 따뜻한 봄날, 우연히 마주친      │
│ 두 사람이 5년의 시간을 함께하며...        │
│                                  [선택] │
│                                         │
│ [2] ────────────────────────────────    │
│ 소중한 인연으로 만나...                   │
│                                  [선택] │
│                                         │
│ [3] ────────────────────────────────    │
│ 서로에게 스며든 두 사람이...              │
│                                  [선택] │
│                                         │
│      [다시 만들기]  [직접 수정하기]        │
│                                         │
└─────────────────────────────────────────┘
```

### 2.2. Input Options

#### 만남 계기 (meetingContext)

```typescript
const meetingOptions = [
  { value: 'blind', label: '소개팅' },
  { value: 'school', label: '학교/동문' },
  { value: 'work', label: '직장' },
  { value: 'friend', label: '친구 소개' },
  { value: 'app', label: '앱/온라인' },
  { value: 'hobby', label: '취미/동호회' },
  { value: 'neighborhood', label: '동네/우연' },
  { value: 'other', label: '기타' },
];
```

#### 분위기 (mood)

```typescript
const moodOptions = [
  { value: 'warm', label: '따뜻한' },
  { value: 'romantic', label: '로맨틱한' },
  { value: 'formal', label: '격식 있는' },
  { value: 'casual', label: '편안한' },
  { value: 'poetic', label: '시적인' },
  { value: 'humorous', label: '유쾌한' },
];
```

#### 키워드 (keywords)

- 자유 입력 (쉼표 구분)
- 최대 5개
- 예: "5년", "대학동기", "캠퍼스커플", "봄", "첫눈"

---

## 3. API Design

### 3.1. Request

```typescript
// POST /api/ai/invitation-message
interface AIInvitationRequest {
  // 필수
  groomName: string;
  brideName: string;
  meetingContext: MeetingContext;
  mood: Mood;
  
  // 선택
  keywords?: string[];
  weddingDate?: string;
  venue?: string;
  
  // 시스템
  regenerate?: boolean;  // 재생성 여부
  previousIds?: string[];  // 이전 결과 제외
}
```

### 3.2. Response

```typescript
// Response
interface AIInvitationResponse {
  data: {
    suggestions: {
      id: string;
      message: string;
      tokens: number;
    }[];
    metadata: {
      model: string;
      totalTokens: number;
      generatedAt: string;
    };
  };
}
```

### 3.3. Error Handling

```typescript
interface AIErrorResponse {
  error: {
    code: 'RATE_LIMIT' | 'CONTENT_FILTER' | 'API_ERROR' | 'INVALID_INPUT';
    message: string;
    retryAfter?: number;  // seconds
  };
}
```

---

## 4. OpenAI Integration

### 4.1. Model Selection

| Model | Usage | Cost (1K tokens) |
|-------|-------|------------------|
| `gpt-4o-mini` | 초대글 생성 (메인) | $0.00015 input / $0.0006 output |
| `gpt-4o` | 복잡한 요청, 이미지 | $0.0025 input / $0.01 output |

**선택 이유**: gpt-4o-mini가 비용 대비 품질이 우수하고, 초대글 생성에 충분

### 4.2. System Prompt

```typescript
const SYSTEM_PROMPT = `당신은 한국 웨딩 청첩장의 초대글을 작성하는 전문 카피라이터입니다.

## 역할
- 예비 신랑신부의 이야기를 감성적이고 아름다운 초대글로 작성
- 한국 웨딩 문화에 맞는 격식과 따뜻함의 균형

## 작성 원칙
1. 진심이 담긴 자연스러운 문체
2. 과하지 않은 적절한 감성
3. 읽기 편한 문장 길이 (3-5문장)
4. 두 사람의 이야기가 담긴 개인화된 내용
5. "합니다" 체 또는 "해요" 체 일관성

## 피해야 할 것
- 뻔한 클리셰 ("운명적인 만남", "천생연분")
- 과도한 수식어
- 너무 긴 문장
- 구체적이지 않은 일반적인 표현

## 출력 형식
- 3가지 다른 버전 제공
- 각 버전은 200자 내외
- JSON 배열로 반환`;
```

### 4.3. User Prompt Template

```typescript
function buildUserPrompt(input: AIInvitationRequest): string {
  return `
## 커플 정보
- 신랑: ${input.groomName}
- 신부: ${input.brideName}
${input.weddingDate ? `- 예식일: ${input.weddingDate}` : ''}
${input.venue ? `- 장소: ${input.venue}` : ''}

## 작성 조건
- 만남 계기: ${getMeetingLabel(input.meetingContext)}
- 분위기: ${getMoodLabel(input.mood)}
${input.keywords?.length ? `- 키워드: ${input.keywords.join(', ')}` : ''}

위 정보를 바탕으로 3가지 서로 다른 스타일의 초대글을 작성해주세요.
JSON 형식으로 응답해주세요: { "messages": ["초대글1", "초대글2", "초대글3"] }
`;
}
```

### 4.4. API Call Implementation

```typescript
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInvitationMessage(
  input: AIInvitationRequest
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(input) },
    ],
    temperature: 0.8,  // 창의성
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  
  return parsed.messages;
}
```

---

## 5. Rate Limiting & Costs

### 5.1. Rate Limits

| Limit Type | Value | Scope |
|------------|-------|-------|
| 분당 요청 | 5회 | 사용자당 |
| 일일 요청 | 20회 | 사용자당 |
| 일일 전체 | 10,000회 | 서비스 전체 |

### 5.2. Cost Estimation

| Scenario | Tokens | Cost |
|----------|--------|------|
| 1회 생성 (input) | ~500 | $0.000075 |
| 1회 생성 (output) | ~600 | $0.00036 |
| **1회 총 비용** | ~1,100 | **~$0.00044** |
| 월 10,000회 | 11M | **~$4.4** |

### 5.3. Cost Control

```typescript
// 비용 제어 미들웨어
async function checkAICosts(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  
  // 사용자 일일 제한
  const userCount = await redis.get(`ai:user:${userId}:${today}`);
  if (userCount && parseInt(userCount) >= 20) {
    throw new Error('일일 사용 한도를 초과했습니다');
  }
  
  // 서비스 전체 제한
  const totalCount = await redis.get(`ai:total:${today}`);
  if (totalCount && parseInt(totalCount) >= 10000) {
    throw new Error('서비스 일일 한도 도달');
  }
  
  return true;
}
```

---

## 6. Content Moderation

### 6.1. Input Validation

```typescript
function validateInput(input: AIInvitationRequest): ValidationResult {
  const errors: string[] = [];
  
  // 이름 검증
  if (!isValidName(input.groomName)) {
    errors.push('신랑 이름이 유효하지 않습니다');
  }
  if (!isValidName(input.brideName)) {
    errors.push('신부 이름이 유효하지 않습니다');
  }
  
  // 키워드 필터링
  if (input.keywords) {
    const filtered = input.keywords.filter(k => !containsBadWord(k));
    if (filtered.length !== input.keywords.length) {
      errors.push('부적절한 키워드가 포함되어 있습니다');
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 6.2. Output Filtering

```typescript
async function filterOutput(messages: string[]): Promise<string[]> {
  return messages.map(msg => {
    // 부적절한 내용 필터링
    let filtered = msg;
    
    // 외부 링크 제거
    filtered = filtered.replace(/https?:\/\/\S+/g, '');
    
    // 특수 문자 정리
    filtered = filtered.replace(/[<>]/g, '');
    
    return filtered.trim();
  });
}
```

### 6.3. OpenAI Content Filter

```typescript
const response = await openai.chat.completions.create({
  // ...
  // OpenAI 자체 content filter 활용
});

// finish_reason 체크
if (response.choices[0].finish_reason === 'content_filter') {
  throw new Error('생성된 내용이 정책에 위반됩니다');
}
```

---

## 7. Caching Strategy

### 7.1. 결과 캐싱

```typescript
// 동일 입력에 대한 캐싱 (비용 절약)
async function getCachedOrGenerate(
  input: AIInvitationRequest
): Promise<string[]> {
  const cacheKey = generateCacheKey(input);
  
  // 캐시 확인
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 새로 생성
  const messages = await generateInvitationMessage(input);
  
  // 캐시 저장 (24시간)
  await redis.set(cacheKey, JSON.stringify(messages), 'EX', 86400);
  
  return messages;
}

function generateCacheKey(input: AIInvitationRequest): string {
  const normalized = {
    meeting: input.meetingContext,
    mood: input.mood,
    keywords: input.keywords?.sort().join(',') || '',
  };
  return `ai:invitation:${hash(JSON.stringify(normalized))}`;
}
```

### 7.2. 캐싱 제외 조건

- `regenerate: true` 플래그
- 이름이 포함된 개인화 요청
- 특정 날짜/장소 포함 요청

---

## 8. Fallback Strategy

### 8.1. API 실패 시

```typescript
async function generateWithFallback(
  input: AIInvitationRequest
): Promise<string[]> {
  try {
    return await generateInvitationMessage(input);
  } catch (error) {
    // Rate limit → 재시도 안내
    if (error.code === 'rate_limit') {
      throw new UserError('잠시 후 다시 시도해주세요', { retryAfter: 60 });
    }
    
    // API 오류 → 템플릿 제공
    console.error('AI generation failed:', error);
    return getTemplateMessages(input);
  }
}
```

### 8.2. 템플릿 메시지 (Fallback)

```typescript
const templateMessages: Record<Mood, string[]> = {
  warm: [
    '따뜻한 봄날, 서로에게 스며든 두 사람이 이제 평생을 약속하려 합니다. 저희의 새로운 시작을 함께 축복해주세요.',
    '소중한 인연으로 만나 사랑을 키워온 저희가 이제 하나의 가정을 이루려 합니다. 귀한 걸음으로 축복해주시면 감사하겠습니다.',
    '서로에게 가장 편안한 사람이 된 두 사람이 평생 서로의 곁을 지키기로 했습니다. 저희의 약속을 지켜봐주세요.',
  ],
  romantic: [
    // ...
  ],
  // ...
};
```

---

## 9. Analytics & Monitoring

### 9.1. 추적 메트릭

| Metric | Description |
|--------|-------------|
| `ai.generation.count` | 생성 요청 수 |
| `ai.generation.latency` | 응답 시간 |
| `ai.generation.tokens` | 토큰 사용량 |
| `ai.generation.cost` | 비용 |
| `ai.generation.error` | 에러 수 |
| `ai.selection.rate` | 선택률 (생성 vs 직접작성) |

### 9.2. Logging

```typescript
async function logAIUsage(params: {
  userId: string;
  input: AIInvitationRequest;
  output: string[];
  tokens: number;
  latency: number;
  selected?: string;  // 사용자가 선택한 메시지
}) {
  await prisma.aiUsageLog.create({
    data: {
      userId: params.userId,
      feature: 'invitation_message',
      inputHash: hash(JSON.stringify(params.input)),
      tokensUsed: params.tokens,
      latencyMs: params.latency,
      selectedIndex: params.selected 
        ? params.output.indexOf(params.selected) 
        : null,
      createdAt: new Date(),
    },
  });
}
```

---

## 10. Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...  # Optional

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=5
AI_RATE_LIMIT_PER_DAY=20
AI_DAILY_BUDGET=10000  # 일일 전체 요청 수

# Feature Flags
AI_ENABLED=true
AI_CACHE_ENABLED=true
```

---

## 11. Testing

### 11.1. 테스트 케이스

```typescript
describe('AI Invitation Message', () => {
  it('should generate 3 unique messages', async () => {
    const result = await generateInvitationMessage({
      groomName: '지훈',
      brideName: '민영',
      meetingContext: 'school',
      mood: 'warm',
    });
    
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);  // 모두 다른 메시지
  });
  
  it('should respect rate limits', async () => {
    // 6번째 요청은 실패해야 함
    for (let i = 0; i < 5; i++) {
      await generateInvitationMessage({ ... });
    }
    
    await expect(generateInvitationMessage({ ... }))
      .rejects.toThrow('rate limit');
  });
  
  it('should filter inappropriate content', async () => {
    const result = await generateInvitationMessage({
      // ...
      keywords: ['부적절한단어'],  // 필터링 대상
    });
    
    // 에러 또는 필터링된 결과
  });
});
```

### 11.2. Mock for Development

```typescript
// 개발 환경에서 API 호출 없이 테스트
if (process.env.NODE_ENV === 'development' && process.env.AI_MOCK) {
  return [
    '[Mock] 따뜻한 봄날, 서로에게 스며든 두 사람이...',
    '[Mock] 소중한 인연으로 만나 사랑을 키워온...',
    '[Mock] 서로에게 가장 편안한 사람이 된...',
  ];
}
```

---

## 12. Future Enhancements

### 12.1. Phase 2 기능

| Feature | Description |
|---------|-------------|
| 스타일 학습 | 사용자가 좋아하는 문체 학습 |
| A/B 테스트 | 어떤 스타일이 더 선택되는지 |
| 다국어 | 영문 초대글 지원 |

### 12.2. 고려 중인 기능

| Feature | 검토 사항 |
|---------|----------|
| 이미지 설명 | 갤러리 alt 텍스트 자동 생성 (접근성) |
| 방명록 요약 | 예식 후 방명록 모아보기 요약 |
