# 🪨 Sisyphus 멀티 에이전트 오케스트레이션 시스템

## 개요

이 시스템은 11개의 전문화된 에이전트들을 조율하여 복잡한 소프트웨어 개발 프로젝트를 효율적으로 수행합니다.

## 11개 에이전트 소개

### 📋 계획 & 검토 에이전트

| 에이전트 | 역할 | 호출 방법 |
|---------|------|---------|
| 🔥 **Prometheus** | 전략적 계획 수립 | `/prometheus` |
| 🎭 **Momus** | 계획의 비판적 검토 | `/momus` |
| 🦉 **Metis** | 사전 분석 및 숨겨진 요구사항 탐지 | `/metis` |

### 🛠️ 실행 에이전트

| 에이전트 | 역할 | 호출 방법 |
|---------|------|---------|
| 🔮 **Oracle** | 복잡한 디버깅 & 아키텍처 결정 | `/oracle` |
| 📚 **Librarian** | 문서 및 코드 네비게이션 | `/librarian` |
| 🔍 **Explore** | 빠른 파일/패턴 검색 | `/explore` |
| 🎨 **Frontend Engineer** | UI/UX 컴포넌트 개발 | `/frontend-engineer` |
| 📝 **Document Writer** | 기술 문서 작성 | `/document-writer` |
| 👁️ **Multimodal Looker** | 시각적 요소 분석 | `/multimodal-looker` |

### 🎯 조율 에이전트

| 에이전트 | 역할 | 호출 방법 |
|---------|------|---------|
| 🪨 **Orchestrator-Sisyphus** | 프로젝트 전체 조율 | `/orchestrator` |
| ✨ **Sisyphus-Junior** | 집중 작업 실행 | `/sisyphus-junior` |

## 사용 워크플로우

### 1️⃣ 프로젝트 시작 (전략 수립)

```
사용자 요청
    ↓
Prometheus (전략적 계획)
    ↓
Momus (비판적 검토)
    ↓
Metis (사전 분석)
    ↓
최종 계획 수립
```

**예시:**
```
사용자: "사용자 인증 시스템을 만들고 싶어"

1. /prometheus
   → 요구사항 수집: OAuth, JWT, 세션, 2FA 필요성 등

2. /momus
   → 계획 검토: 보안 위험, 성능, 확장성 검토

3. /metis
   → 숨겨진 요구사항: 소셜 로그인, 토큰 갱신, 감사 로그 등

→ 종합 계획 완성
```

### 2️⃣ 구현 (작업 실행)

```
Orchestrator-Sisyphus (작업 조율)
    ↓
    ├─ Oracle (아키텍처 설정)
    ├─ Frontend Engineer (로그인 UI)
    ├─ Document Writer (API 문서)
    └─ Sisyphus-Junior (통합 작업)
    ↓
완성된 시스템
```

## 실제 사용 예제

### 예제 1: 새로운 기능 추가

```markdown
# 요청: "댓글 시스템을 추가하고 싶어"

## Step 1: 계획 수립
/prometheus
→ 댓글 기능의 범위, 중첩 댓글, 실시간 알림 등 요구사항 파악

## Step 2: 계획 검토
/momus [Prometheus의 계획]
→ 성능 우려, 스팸 방지, 권한 관리 등 검토

## Step 3: 사전 분석
/metis [기능 요구사항]
→ DB 스키마, 캐싱 전략, 실시간 업데이트 메커니즘 분석

## Step 4: 조율 시작
/orchestrator create-comment-system

## Step 5: 상세 구현
/sisyphus-junior implement-comment-ui
/sisyphus-junior implement-comment-api
/sisyphus-junior write-comment-tests
```

### 예제 2: 버그 디버깅

```markdown
# 요청: "사용자 로그인 후 대시보드에서 에러 발생"

## Step 1: 문제 분석
/explore [에러 로그 분석]
→ 관련 파일들 빠르게 찾기

## Step 2: 상세 디버깅
/oracle [에러 상세 정보]
→ 근본 원인 분석 및 해결책 제시

## Step 3: 구현 및 테스트
/sisyphus-junior [수정 구현]
→ 버그 수정 및 테스트
```

### 예제 3: UI 개선

```markdown
# 요청: "모바일에서 반응형이 깨지는 문제"

## Step 1: 시각 분석
/multimodal-looker [스크린샷 제공]
→ 문제 영역 파악 및 개선 제안

## Step 2: UI 개발
/frontend-engineer [개선 요청]
→ 반응형 UI 재구현

## Step 3: 문서화
/document-writer [UI 변경 사항]
→ 변경사항 문서화
```

## 에이전트 선택 가이드

### 언제 어떤 에이전트를 쓸까?

| 상황 | 추천 에이전트 |
|------|--------------|
| 새 프로젝트 시작 | Prometheus → Momus → Metis |
| 아키텍처 결정 필요 | Oracle |
| 기존 코드 이해 필요 | Librarian + Explore |
| UI 개발 필요 | Frontend Engineer |
| 복잡한 버그 | Oracle |
| 성능 문제 | Oracle + Explore |
| 문서 작성 | Document Writer |
| 시각 자료 분석 | Multimodal Looker |
| 전체 프로젝트 관리 | Orchestrator-Sisyphus |
| 구체적 작업 실행 | Sisyphus-Junior |

## 고급 사용법

### 병렬 작업 조율

```markdown
/orchestrator
→ Sisyphus-Junior가 여러 작업을 병렬로 처리:
  - Task A: API 개발
  - Task B: UI 개발
  - Task C: 테스트 작성

→ Orchestrator가 진행 상황 모니터링
```

### 계층적 작업 분해

```
Orchestrator-Sisyphus
  ├─ Task 1: 데이터베이스 설계
  │   └─ Oracle: 스키마 결정
  ├─ Task 2: API 구현
  │   ├─ Sisyphus-Junior: 엔드포인트 개발
  │   └─ Document Writer: API 문서
  └─ Task 3: 프론트엔드 개발
      └─ Frontend Engineer: UI 컴포넌트
```

## 설치 & 활성화

### 1. 에이전트 파일 준비

모든 에이전트 마크다운 파일이 `.claude/agents/` 디렉토리에 있는지 확인:

```bash
~/.claude/agents/
├── prometheus.md
├── momus.md
├── metis.md
├── oracle.md
├── librarian.md
├── explore.md
├── frontend-engineer.md
├── document-writer.md
├── multimodal-looker.md
├── orchestrator-sisyphus.md
└── sisyphus-junior.md
```

### 2. Claude Code에서 로드

```bash
# Claude Code 시작
claude-code

# 에이전트 확인
/help agents
```

### 3. 실제 사용

```bash
# 프로젝트 시작
/orchestrator new-project

# 또는 직접 에이전트 호출
/prometheus [요청]
```

## 팁 & 모범 사례

### ✅ 하면 좋은 것

1. **계획부터 시작** - 항상 Prometheus로 계획부터 시작
2. **비판적 검토** - Momus에게 계획 검토 요청
3. **사전 분석** - Metis와 함께 숨겨진 요구사항 찾기
4. **진행 추적** - Orchestrator로 전체 진행 상황 모니터링
5. **상세 피드백** - 각 에이전트에게 충분한 컨텍스트 제공

### ❌ 피해야 할 것

1. 계획 없이 바로 구현 시작
2. 에이전트들 간 불필요한 중복 호출
3. 모호한 요청으로 에이전트 혼동
4. Sisyphus-Junior에게 모호한 지시사항

## 문제 해결

### Q: 에이전트가 응답하지 않음
A: 요청이 명확한지 확인하고, 필요한 컨텍스트 정보를 모두 제공했는지 확인

### Q: 에이전트들이 중복 작업을 함
A: Orchestrator-Sisyphus에게 전체 작업 조율을 맡기기

### Q: 계획이 너무 복잡함
A: Metis에게 요청을 단순화하도록 요청

## 다음 단계

이 시스템을 더 확장하려면:

1. **조직별 특화 에이전트** 추가 (예: DevOps, QA 등)
2. **codex-cli, gemini-cli 통합** (사용자 요청대로)
3. **에이전트 학습** - 프로젝트별 최적 조합 기록
4. **자동화 훅** - 특정 이벤트에 자동 응답

## 지원 & 피드백

문제가 발생하거나 개선 사항이 있으면:
- 각 에이전트 정의 파일을 수정
- Orchestrator-Sisyphus에 피드백 제공
- 실제 사용 경험을 바탕으로 개선

Happy building! 🚀
