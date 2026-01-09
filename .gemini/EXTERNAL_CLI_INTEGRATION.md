# 🔗 외부 CLI 통합 가이드

Sisyphus 멀티 에이전트 시스템에 **codex-cli**와 **gemini-cli**를 통합하여 더 강력한 AI 기반 개발 워크플로우를 구축합니다.

## 📋 개요

| 통합 | 역할 | CLI | 상태 |
|------|------|-----|------|
| 🪨 Orchestrator | 프로젝트 조율 | codex-cli | ✨ 통합됨 |
| 🎨 Frontend Engineer | UI/UX 디자인 | gemini-cli | ✨ 통합됨 |

## 🎯 통합 구조

```
Claude Code
    ↓
Sisyphus Orchestrator
    ├─ 기본 조율 (Claude 내부)
    └─ 고급 조율 → codex-cli (외부 AI)
              ↓
          OpenAI Codex
              ↓
          조율 결과 반영

Frontend Engineer
    ├─ 기본 컴포넌트 개발 (Claude 내부)
    └─ 시각 디자인 → gemini-cli (외부 AI)
              ↓
          Google Gemini
              ↓
          디자인 결과 반영
```

## 🚀 설치 & 설정

### 1단계: CLI 도구 설치

#### Codex CLI 설치 (Orchestrator용)

```bash
# npm으로 설치
npm install -g codex-cli

# 또는 pip로 설치
pip install openai-codex

# 또는 직접 설치
git clone https://github.com/openai/codex
cd codex
npm install -g .

# 설치 확인
codex --version
```

#### Gemini CLI 설치 (Frontend Engineer용)

```bash
# npm으로 설치
npm install -g gemini-cli

# 또는 pip로 설치
pip install google-gemini-cli

# 또는 직접 설치
git clone https://github.com/google/gemini-cli
cd gemini-cli
npm install -g .

# 설치 확인
gemini --version
```

### 2단계: API 키 설정

#### OpenAI API 키 (Codex용)

```bash
# 환경변수 설정
export OPENAI_API_KEY="sk-..."

# 또는 .env 파일에 추가
echo 'OPENAI_API_KEY=sk-...' >> ~/.bashrc

# ~/.bashrc 또는 ~/.zshrc에 영구 저장
nano ~/.bashrc
# 또는
nano ~/.zshrc
```

#### Google API 키 (Gemini용)

```bash
# 환경변수 설정
export GOOGLE_API_KEY="AIzaSy..."

# 또는 .env 파일에 추가
echo 'GOOGLE_API_KEY=AIzaSy...' >> ~/.bashrc

# ~/.bashrc 또는 ~/.zshrc에 영구 저장
nano ~/.bashrc
# 또는
nano ~/.zshrc
```

### 3단계: 스크립트 권한 설정

```bash
# 프로젝트 디렉토리로 이동
cd your-project

# 스크립트 실행 권한 부여
chmod +x .claude/scripts/*.sh

# 권한 확인
ls -la .claude/scripts/
```

### 4단계: 설정 파일 검증

```bash
# config.json 검증
cat .claude/config.json | jq .

# CLI 설치 확인
which codex
which gemini

# 환경변수 확인
echo $OPENAI_API_KEY
echo $GOOGLE_API_KEY
```

## 💡 사용 방법

### Orchestrator + Codex CLI

#### 자동 방식 (권장)

```bash
# Claude Code에서
/orchestrator "React 실시간 채팅 앱"

# 내부적으로 다음 스크립트가 실행됨:
# bash .claude/scripts/orchestrator-with-codex.sh "React 실시간 채팅 앱"
```

#### 수동 방식

```bash
# 직접 스크립트 실행
bash .claude/scripts/orchestrator-with-codex.sh "프로젝트 설명"

# 또는 저수준 CLI 호출
bash .claude/scripts/run-external-cli.sh codex orchestrate "프로젝트 설명"
```

#### 워크플로우

```
사용자 요청
    ↓
Claude Orchestrator 분석
    ↓
Codex CLI 호출
    ├─ 프로젝트 구조 분석
    ├─ 의존성 최적화
    ├─ 병렬 처리 계획
    └─ 리소스 할당 결과
    ↓
결과 통합
    ↓
Prometheus → Momus → Metis
    ↓
특화 에이전트 작업 위임
```

### Frontend Engineer + Gemini CLI

#### 자동 방식 (권장)

```bash
# Claude Code에서
/frontend-engineer "다크 모드 토글 버튼"

# 내부적으로 다음 스크립트가 실행됨:
# bash .claude/scripts/frontend-with-gemini.sh "다크 모드 토글 버튼"
```

#### 수동 방식

```bash
# 직접 스크립트 실행
bash .claude/scripts/frontend-with-gemini.sh "컴포넌트 요청"

# 또는 저수준 CLI 호출
bash .claude/scripts/run-external-cli.sh gemini design "컴포넌트 요청"
```

#### 워크플로우

```
사용자 요청 (UI 컴포넌트)
    ↓
Claude 요구사항 분석
    ↓
Gemini CLI 호출
    ├─ 시각 디자인 생성
    ├─ 색상 팔레트 제안
    ├─ 접근성 검사
    └─ 반응형 검증
    ↓
Claude 컴포넌트 구현
    ├─ React/TypeScript 코드
    ├─ Tailwind CSS 스타일
    └─ 애니메이션 추가
    ↓
자동 산출물 생성
    ├─ 컴포넌트 파일
    ├─ 스토리북 문서
    └─ 테스트 코드
```

## 📊 실전 예제

### 예제 1: 전체 프로젝트 시작 (with Codex)

```bash
# Step 1: 프로젝트 요청
/orchestrator "Next.js 14 + TypeScript + PostgreSQL 기반 전자상거래 플랫폼"

# 내부 실행 흐름:
# 1. Prometheus: 전략적 계획
# 2. Momus: 비판적 검토
# 3. Metis: 사전 분석
# 4. Codex CLI 호출:
#    bash .claude/scripts/orchestrator-with-codex.sh "..."
# 5. 특화 에이전트 작업 위임
# 6. Sisyphus-Junior 집중 실행
```

### 예제 2: UI 컴포넌트 생성 (with Gemini)

```bash
# Step 1: 컴포넌트 요청
/frontend-engineer "상품 카드 - 이미지, 제목, 가격, 평점, 장바구니 버튼"

# 내부 실행 흐름:
# 1. 요구사항 분석
# 2. Gemini CLI 호출:
#    bash .claude/scripts/frontend-with-gemini.sh "..."
# 3. Gemini 디자인 생성
# 4. Claude 컴포넌트 구현
# 5. 자동 산출물 생성:
#    - components/ProductCard.tsx
#    - components/ProductCard.stories.tsx
#    - components/ProductCard.test.tsx
```

### 예제 3: 복합 작업 (Multiple Integration)

```bash
# 1. 프로젝트 시작 (Codex 조율)
/orchestrator "모바일-퍼스트 소셜 미디어 앱"

# 2. 로그인 UI 생성 (Gemini 디자인)
/frontend-engineer "로그인 폼 - 이메일/비밀번호, 소셜 로그인, Remember me"

# 3. 피드 UI 생성 (Gemini 디자인)
/frontend-engineer "무한 스크롤 피드 - 포스트 카드, 좋아요, 댓글"

# 4. 전체 진행 추적 (Orchestrator)
/orchestrator status
```

## 🔧 설정 파일 커스터마이징

### config.json 수정

프로젝트별 설정을 커스터마이징할 수 있습니다:

```json
{
  "external_cli_config": {
    "codex": {
      "command_name": "codex",
      "binary_path": "/custom/path/to/codex",
      "required": false,
      "fallback_enabled": true
    },
    "gemini": {
      "command_name": "gemini",
      "binary_path": "/custom/path/to/gemini",
      "required": false,
      "fallback_enabled": true
    }
  },
  "integration": {
    "enable_external_cli": true,
    "timeout_seconds": 300,
    "retry_on_failure": true,
    "max_retries": 2
  }
}
```

## ⚙️ 트러블슈팅

### Codex CLI 문제

#### CLI를 찾을 수 없음

```bash
# 설치 확인
which codex

# 설치되지 않았으면 다시 설치
npm install -g codex-cli

# 경로 문제 시 절대 경로로 설정
export PATH="/usr/local/bin:$PATH"
```

#### API 키 오류

```bash
# API 키 설정 확인
echo $OPENAI_API_KEY

# 키 설정
export OPENAI_API_KEY="sk-..."

# 권한 확인
openai auth
```

#### 타임아웃 오류

```bash
# config.json에서 타임아웃 증가
"timeout_seconds": 600  # 10분으로 설정
```

### Gemini CLI 문제

#### CLI를 찾을 수 없음

```bash
# 설치 확인
which gemini

# 설치되지 않았으면 다시 설치
npm install -g gemini-cli

# 또는 pip로 설치
pip install google-gemini-cli
```

#### API 키 오류

```bash
# API 키 설정 확인
echo $GOOGLE_API_KEY

# 키 설정
export GOOGLE_API_KEY="AIzaSy..."

# 권한 확인
gemini auth
```

### 스크립트 권한 문제

```bash
# 스크립트 실행 불가능 오류
chmod +x .claude/scripts/*.sh

# 모든 권한 확인
ls -la .claude/scripts/
```

### 로그 파일 확인

```bash
# 로그 디렉토리 확인
ls -la .claude/logs/

# 최근 로그 확인
tail -100 .claude/logs/orchestrator/latest.log
tail -100 .claude/logs/frontend/latest.log

# 특정 실행의 로그 확인
cat .claude/logs/orchestrator/20240110_143025.log
```

## 🎯 성능 최적화

### 병렬 처리

여러 컴포넌트를 동시에 생성:

```bash
# 터미널 1: 로그인 UI 생성
/frontend-engineer "로그인 폼"

# 터미널 2: 대시보드 UI 생성 (동시 실행)
/frontend-engineer "대시보드 레이아웃"

# Orchestrator가 모든 작업 조율
/orchestrator status
```

### 캐싱 활용

자주 사용하는 설정을 캐시:

```bash
# .claude/.cache 디렉토리에 자동 저장
ls -la .claude/.cache/

# 캐시 초기화 (필요시)
rm -rf .claude/.cache/*
```

## 📈 모니터링 & 로깅

### 로그 수준 조정

```bash
# 상세 로그 활성화
export DEBUG=sisyphus:*

# 또는 특정 모듈만
export DEBUG=sisyphus:orchestrator
export DEBUG=sisyphus:frontend
```

### 로그 분석

```bash
# 오류 로그만 확인
grep ERROR .claude/logs/**/*.log

# 특정 시간대의 로그
grep "10:30" .claude/logs/**/*.log

# CLI 호출 기록
grep "CLI" .claude/logs/**/*.log
```

## 🔐 보안 고려사항

### API 키 보안

```bash
# 절대 git에 커밋하지 않기
echo ".env.local" >> .gitignore
echo ".claude/secrets/" >> .gitignore

# 환경변수만 사용
export OPENAI_API_KEY="..."
export GOOGLE_API_KEY="..."

# 또는 .env.local 파일 사용
cat > .env.local << EOF
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIzaSy...
EOF
```

### 스크립트 서명 (선택사항)

```bash
# 스크립트 체크섬 확인
sha256sum .claude/scripts/*.sh

# 변조 감지
sha256sum -c .claude/scripts/checksums.txt
```

## 🚀 고급 기능

### 커스텀 CLI 통합

새로운 CLI를 추가하려면:

```bash
# 1. config.json에 설정 추가
# 2. run-external-cli.sh에 케이스 추가
# 3. 에이전트 마크다운 수정

# 예: GitHub CLI 통합
vim .claude/scripts/run-external-cli.sh
# gh 케이스 추가
```

### 자동화 훅

특정 이벤트에 CLI 자동 호출:

```bash
# .claude/hooks/post-task.sh
#!/bin/bash
# 작업 완료 후 자동 실행

if [ "$TASK_TYPE" = "ui" ]; then
    bash .claude/scripts/frontend-with-gemini.sh "$TASK_INPUT"
fi
```

## 📚 다음 단계

1. ✅ CLI 설치 & 설정 완료
2. 📖 [ORCHESTRATOR_GUIDE.md](./ORCHESTRATOR_GUIDE.md) 읽기
3. 🧪 간단한 프로젝트에서 테스트
4. 📈 실제 프로젝트에 적용
5. 🎯 워크플로우 최적화

## 💬 FAQ

### Q: CLI가 설치되지 않아도 작동하나요?
A: 네! Fallback이 활성화되어 있으면 Claude 내부 에이전트로 계속 작동합니다.

### Q: 여러 프로젝트에서 같은 CLI를 사용할 수 있나요?
A: 네! 전역으로 설치된 CLI는 모든 프로젝트에서 사용 가능합니다.

### Q: API 키가 노출되면?
A: 즉시 API 제공자(OpenAI, Google)에서 키를 재생성하세요.

### Q: 오프라인에서 사용할 수 있나요?
A: 외부 CLI는 온라인이 필요하지만, Claude Code는 로컬에서 작동합니다.

---

**Happy building with external CLI integration! 🚀**
