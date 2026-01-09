# 🎯 Sisyphus + 외부 CLI 통합 완성 가이드

## 🎉 무엇이 구현되었나

완전한 멀티 에이전트 오케스트레이션 시스템에 **codex-cli**와 **gemini-cli**를 성공적으로 통합했습니다.

### 📦 생성된 파일 구조

```
.claude/
├── agents/                          # 11개 전문 에이전트
│   ├── prometheus.md               # 🔥 전략 계획
│   ├── momus.md                    # 🎭 비판 검토
│   ├── metis.md                    # 🦉 사전 분석
│   ├── oracle.md                   # 🔮 디버깅/아키텍처
│   ├── librarian.md                # 📚 문서 탐색
│   ├── explore.md                  # 🔍 빠른 탐색
│   ├── frontend-engineer.md        # 🎨 UI/UX (+ Gemini 통합)
│   ├── document-writer.md          # 📝 문서 작성
│   ├── multimodal-looker.md        # 👁️ 시각 분석
│   ├── orchestrator-sisyphus.md    # 🪨 조율 (+ Codex 통합)
│   └── sisyphus-junior.md          # ✨ 집중 실행
├── scripts/                         # 통합 스크립트
│   ├── run-external-cli.sh         # 외부 CLI 범용 실행기
│   ├── orchestrator-with-codex.sh  # Orchestrator + Codex 통합
│   └── frontend-with-gemini.sh     # Frontend + Gemini 통합
├── config.json                      # 중앙 설정 파일
├── README.md                        # 시지푸스 전체 개요
├── ORCHESTRATOR_GUIDE.md           # 사용 워크플로우
├── INSTALLATION.md                 # 설치 가이드
├── EXTERNAL_CLI_INTEGRATION.md     # 외부 CLI 상세 가이드
└── INTEGRATION_SUMMARY.md          # 이 파일
```

## 🚀 빠른 시작

### 1️⃣ 설정 (5분)

```bash
# 1. CLI 도구 설치
npm install -g codex-cli gemini-cli

# 또는 pip로
pip install openai-codex google-gemini-cli

# 2. API 키 설정
export OPENAI_API_KEY="sk-..."
export GOOGLE_API_KEY="AIzaSy..."

# 3. 스크립트 권한 설정
chmod +x .claude/scripts/*.sh

# 4. 설정 확인
cat .claude/config.json
```

### 2️⃣ 사용 방법

```bash
# 프로젝트 시작 (Codex 조율)
/orchestrator "React 실시간 채팅 앱"

# UI 컴포넌트 생성 (Gemini 디자인)
/frontend-engineer "다크 모드 토글"

# 또는 직접 스크립트 실행
bash .claude/scripts/orchestrator-with-codex.sh "프로젝트"
bash .claude/scripts/frontend-with-gemini.sh "컴포넌트"
```

## 📊 통합 아키텍처

### 전체 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Code                               │
│                  (메인 상호작용)                             │
└────────────────────────────┬────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
     │Orchestrator │ │   Prometh.  │ │   Momus     │
     │  + Codex    │ │             │ │             │
     └──────┬──────┘ └─────────────┘ └─────────────┘
            │
     ┌──────▼─────────────────────────────────────┐
     │     codex-cli                              │
     │  (OpenAI 조율 AI)                          │
     │  - 프로젝트 구조                           │
     │  - 의존성 최적화                          │
     │  - 병렬 처리 계획                         │
     └──────┬─────────────────────────────────────┘
            │
     ┌──────▼──────┐        ┌──────────────┐
     │Frontend Eng │        │Other Agents  │
     │  + Gemini   │        │(Oracle, etc) │
     └──────┬──────┘        └──────────────┘
            │
     ┌──────▼─────────────────────────────────────┐
     │     gemini-cli                             │
     │  (Google 디자인 AI)                        │
     │  - 시각 디자인 생성                       │
     │  - 색상 팔레트                            │
     │  - 접근성 검사                            │
     └──────┬─────────────────────────────────────┘
            │
     ┌──────▼──────┐
     │Component    │
     │Generated    │
     └─────────────┘
```

## 🎯 3개 핵심 통합

### ① Orchestrator + Codex CLI

```
사용자: "프로젝트를 시작하고 싶어"
                ↓
    /orchestrator [요청]
                ↓
    Claude: 전략 수립
                ↓
    bash .claude/scripts/orchestrator-with-codex.sh [요청]
                ↓
    ┌─────────────────────────────┐
    │  Codex CLI 실행              │
    │  - 프로젝트 분석             │
    │  - 구조 최적화               │
    │  - 의존성 맵핑               │
    │  - 병렬 처리 계획            │
    └─────────────────────────────┘
                ↓
    결과를 Claude에 반영
                ↓
    최종 계획 + 에이전트 위임
```

**사용 시나리오:**
- 복잡한 프로젝트 시작
- 대규모 리팩토링
- 아키텍처 결정
- 병렬 작업 계획

### ② Frontend Engineer + Gemini CLI

```
사용자: "다크 모드 토글을 만들어줄래?"
                ↓
    /frontend-engineer [요청]
                ↓
    Claude: 요구사항 분석
                ↓
    bash .claude/scripts/frontend-with-gemini.sh [요청]
                ↓
    ┌─────────────────────────────┐
    │  Gemini CLI 실행             │
    │  - 시각 디자인 생성          │
    │  - 색상 팔레트 제안          │
    │  - 접근성 자동 검사          │
    │  - 반응형 검증               │
    └─────────────────────────────┘
                ↓
    Claude: 컴포넌트 구현
                ↓
    자동 산출물 생성
    - React/TypeScript 코드
    - Tailwind 스타일
    - 스토리북 문서
    - 테스트 코드
```

**사용 시나리오:**
- 새 UI 컴포넌트
- 디자인 시스템 구축
- 접근성 개선
- 스토리북 문서화

### ③ 선택적 통합 (다른 에이전트)

```
Oracle, Librarian, Explore, ...
                ↓
    필요시 외부 CLI 호출 가능:
                ↓
    bash .claude/scripts/run-external-cli.sh [cli] [command]
```

## 💻 실제 사용 예제

### 시나리오 1: 전체 프로젝트 시작

```bash
# Step 1: 프로젝트 조율 (Codex)
/orchestrator "Next.js 14 + TypeScript + Supabase 기반 SaaS"

# 내부 동작:
# 1. Prometheus: 전략적 계획
# 2. Momus: 비판적 검토
# 3. Metis: 사전 분석
# 4. codex-cli 실행 (복잡한 의존성 분석)
# 5. 전문 에이전트들에게 작업 위임
# 6. Sisyphus-Junior: 집중 실행

# Step 2: UI 컴포넌트 시작 (Gemini)
/frontend-engineer "로그인 페이지 - 이메일, 소셜 로그인, 2FA"

# 내부 동작:
# 1. 요구사항 분석
# 2. gemini-cli로 디자인 생성
# 3. React 컴포넌트 작성
# 4. Storybook + 테스트 자동 생성
```

### 시나리오 2: 병렬 UI 개발

```bash
# 동시에 여러 컴포넌트 생성
/frontend-engineer "상품 카드"        # 터미널 1
/frontend-engineer "장바구니 버튼"    # 터미널 2
/frontend-engineer "결제 폼"          # 터미널 3

# Orchestrator가 모든 작업 추적
/orchestrator status
```

### 시나리오 3: 복잡한 버그 디버깅

```bash
# Oracle로 분석 후 필요시 Codex 호출
/oracle "데이터베이스 쿼리가 느려요"

# Oracle이 필요하면:
bash .claude/scripts/run-external-cli.sh codex analyze "성능 최적화"
```

## 🎮 커맨드 레퍼런스

### Orchestrator 커맨드

```bash
# 프로젝트 시작 (Codex 통합)
/orchestrator "프로젝트 설명"

# 또는 직접 스크립트 실행
bash .claude/scripts/orchestrator-with-codex.sh "프로젝트 설명"

# 저수준 호출
bash .claude/scripts/run-external-cli.sh codex orchestrate "프로젝트"
```

### Frontend Engineer 커맨드

```bash
# 컴포넌트 생성 (Gemini 통합)
/frontend-engineer "컴포넌트 요청"

# 또는 직접 스크립트 실행
bash .claude/scripts/frontend-with-gemini.sh "컴포넌트 요청"

# 저수준 호출
bash .claude/scripts/run-external-cli.sh gemini design "컴포넌트"
```

### 다른 에이전트 커맨드

```bash
# Prometheus (계획)
/prometheus "프로젝트 요청"

# Momus (검토)
/momus [계획]

# Metis (분석)
/metis "요구사항"

# Oracle (디버깅)
/oracle "기술 문제"

# Librarian (문서)
/librarian "찾을 것"

# Explore (탐색)
/explore "패턴"

# Document Writer (문서)
/document-writer "작성할 것"

# Multimodal Looker (시각)
/multimodal-looker [이미지 또는 요청]

# Sisyphus-Junior (실행)
/sisyphus-junior "구체적 작업"
```

## 📚 문서 네비게이션

| 문서 | 내용 | 대상 |
|------|------|------|
| **README.md** | 전체 개요, 에이전트 소개 | 처음 사용자 |
| **INSTALLATION.md** | 에이전트 설치 & 설정 | 설치 담당자 |
| **ORCHESTRATOR_GUIDE.md** | 사용 워크플로우, 예제 | 일반 사용자 |
| **EXTERNAL_CLI_INTEGRATION.md** | CLI 설치, 고급 설정 | CLI 통합 담당자 |
| **INTEGRATION_SUMMARY.md** | 이 파일 - 통합 개요 | 모두 |

## ✅ 체크리스트

설정 완료 확인:

```bash
# 1. CLI 설치 확인
which codex
which gemini

# 2. API 키 설정 확인
echo $OPENAI_API_KEY
echo $GOOGLE_API_KEY

# 3. 스크립트 권한 확인
ls -la .claude/scripts/

# 4. 설정 파일 확인
cat .claude/config.json | jq .

# 5. 에이전트 파일 확인
ls -la .claude/agents/
```

## 🔧 트러블슈팅 빠른 가이드

### CLI를 찾을 수 없음

```bash
npm install -g codex-cli gemini-cli
# 또는
pip install openai-codex google-gemini-cli
```

### API 키 오류

```bash
export OPENAI_API_KEY="sk-..."
export GOOGLE_API_KEY="AIzaSy..."
```

### 스크립트 실행 불가

```bash
chmod +x .claude/scripts/*.sh
```

### 로그 확인

```bash
tail -50 .claude/logs/orchestrator/*.log
tail -50 .claude/logs/frontend/*.log
```

더 자세한 내용은 [EXTERNAL_CLI_INTEGRATION.md](./EXTERNAL_CLI_INTEGRATION.md) 참고

## 🌟 주요 이점

| 기능 | 이전 | 지금 |
|------|------|------|
| 프로젝트 조율 | Claude 내부 | Claude + Codex AI |
| UI 디자인 | Claude 내부 | Claude + Gemini AI |
| 동시 처리 | 순차 | 병렬 |
| 설계 품질 | 중간 | 고급 |
| 외부 AI 활용 | 불가 | 가능 |
| 확장성 | 낮음 | 높음 |

## 🚀 다음 단계

1. **지금 바로**: [INSTALLATION.md](./INSTALLATION.md)로 설치
2. **5분 안에**: CLI 도구 설치 & API 키 설정
3. **10분 안에**: 간단한 프로젝트 시작 (`/orchestrator "test"`)
4. **30분 안에**: UI 컴포넌트 생성 (`/frontend-engineer "button"`)
5. **지속**: 실제 프로젝트에 적용

## 💡 팁

- **Codex 없이도 작동** - fallback 활성화됨
- **Gemini 없이도 작동** - fallback 활성화됨
- **점진적 통합** - CLI가 필요할 때만 호출
- **캐싱 활용** - 반복 작업 빠르게 처리
- **로그 활용** - 문제 해결에 도움

## 📞 지원

- 설치 문제: [INSTALLATION.md](./INSTALLATION.md)
- CLI 문제: [EXTERNAL_CLI_INTEGRATION.md](./EXTERNAL_CLI_INTEGRATION.md)
- 사용 방법: [ORCHESTRATOR_GUIDE.md](./ORCHESTRATOR_GUIDE.md)
- 일반 정보: [README.md](./README.md)

---

## 🎯 핵심 요약

```
Sisyphus = 11개 에이전트 + Codex 조율 + Gemini 디자인
         = 강력한 멀티 AI 개발 시스템
         = 생산성 극대화 ✨
```

**준비됐나요? 시작합시다! 🚀**

```bash
/orchestrator "나의 프로젝트"
```

---

**마지막 확인**: 모든 파일이 `.claude/` 디렉토리에 생성되었고, 스크립트 권한이 설정되었는지 확인하세요.

```bash
ls -la .claude/
chmod +x .claude/scripts/*.sh
```

Happy building! 🎉
