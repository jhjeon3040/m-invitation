# 🚀 Sisyphus 멀티 에이전트 시스템 설치 가이드

## 빠른 설치 (5분)

### 1단계: 에이전트 파일 복사

프로젝트의 `.claude/agents/` 디렉토리의 모든 파일을 로컬 Claude 설정에 복사합니다.

```bash
# 1. 프로젝트에서 agents 디렉토리 확인
ls -la .claude/agents/

# 2. Claude 홈 디렉토리의 agents 디렉토리로 복사
cp .claude/agents/* ~/.claude/agents/

# 또는 심링크 생성 (권장 - 업데이트 자동 반영)
ln -s $(pwd)/.claude/agents ~/.claude/agents-sisyphus
```

### 2단계: Claude Code에서 로드

```bash
# Claude Code 실행
claude-code

# Claude Code 내에서 에이전트 확인
/help agents

# 출력에 다음 에이전트들이 보여야 함:
# - Prometheus
# - Momus
# - Metis
# - Oracle
# - Librarian
# - Explore
# - Frontend Engineer
# - Document Writer
# - Multimodal Looker
# - Orchestrator-Sisyphus
# - Sisyphus-Junior
```

### 3단계: 간단한 테스트

```bash
# 프로젝트 디렉토리에서
cd your-project

# Prometheus 테스트
/prometheus

# 응답: 프로젝트에 대한 상세한 질문들이 나와야 함
```

## 상세 설치 가이드

### 필수 요구사항

- Claude Code CLI 설치됨
- Bash/Zsh 쉘 환경
- Git (선택사항, 있으면 편함)

### 디렉토리 구조

설치 후 다음 구조를 확인하세요:

```
~/.claude/
├── agents/
│   ├── prometheus.md
│   ├── momus.md
│   ├── metis.md
│   ├── oracle.md
│   ├── librarian.md
│   ├── explore.md
│   ├── frontend-engineer.md
│   ├── document-writer.md
│   ├── multimodal-looker.md
│   ├── orchestrator-sisyphus.md
│   └── sisyphus-junior.md
├── ORCHESTRATOR_GUIDE.md (권장)
└── INSTALLATION.md (이 파일)
```

### 설치 옵션

#### Option A: 직접 복사 (가장 간단)

```bash
# 프로젝트의 agents 폴더에서 모든 .md 파일 복사
mkdir -p ~/.claude/agents
cp .claude/agents/*.md ~/.claude/agents/
```

#### Option B: 심링크 (권장 - 자동 업데이트)

```bash
# 한 번 설정하면 프로젝트 업데이트가 자동 반영됨
mkdir -p ~/.claude
ln -sf $(pwd)/.claude/agents ~/.claude/agents-sisyphus

# Claude Code에서 agents-sisyphus 폴더 사용
```

#### Option C: Git 클론 (팀 협업용)

```bash
# 에이전트들을 별도 저장소로 관리
git clone <your-agents-repo> ~/.claude/agents-custom

# 프로젝트에서 참조
# .claude/claude.json 에 설정 추가
```

## 검증 & 테스트

설치가 제대로 되었는지 확인합니다:

### 1. 에이전트 목록 확인

```bash
claude-code

# Claude Code 실행 후
/help agents

# 출력 예:
# Available Agents:
# - prometheus (🔥 Strategic Planner)
# - momus (🎭 Critical Reviewer)
# - metis (🦉 Pre-Planning Analyst)
# - oracle (🔮 Debugging Expert)
# - librarian (📚 Documentation Specialist)
# - explore (🔍 Fast Explorer)
# - frontend-engineer (🎨 UI/UX Specialist)
# - document-writer (📝 Technical Writer)
# - multimodal-looker (👁️ Visual Analyzer)
# - orchestrator-sisyphus (🪨 Task Coordinator)
# - sisyphus-junior (✨ Focused Executor)
```

### 2. 간단한 워크플로우 테스트

```bash
# 새 프로젝트 디렉토리에서
mkdir test-project
cd test-project

# Test 1: Prometheus에게 요청
/prometheus "간단한 TODO 앱을 만들고 싶어"

# Test 2: 응답이 나오는지 확인
# → Prometheus가 상세한 질문을 제시하면 성공

# Test 3: 다른 에이전트 테스트
/explore "app"  # 파일 검색 테스트
```

### 3. 전체 워크플로우 테스트

```bash
# 시지푸스 전체 시스템 테스트
/orchestrator initialize-project

# 단계별로 실행:
# 1. Prometheus로 계획 수립
# 2. Momus로 계획 검토
# 3. Metis로 사전 분석
# 4. 각 분야별 에이전트 작업
```

## 문제 해결

### 에이전트가 로드되지 않음

**증상:** `/prometheus` 입력 시 "command not found"

**해결:**
```bash
# 1. 파일 위치 확인
ls ~/.claude/agents/

# 2. 권한 확인
chmod 644 ~/.claude/agents/*.md

# 3. Claude Code 재시작
exit
claude-code

# 4. 에이전트 목록 다시 확인
/help agents
```

### 에이전트 응답이 이상함

**증상:** 에이전트가 요청을 이해하지 못함

**해결:**
```bash
# 1. 요청을 더 명확하게 제시
/prometheus "React + TypeScript를 사용해서 실시간 채팅 앱을 만들고 싶어. 예상 기간은 한달입니다."

# 2. 필요한 컨텍스트 제공
cd your-project
/librarian "현재 프로젝트의 구조를 설명해줘"

# 3. 에이전트 재로드
# Claude Code 재시작 후 다시 시도
```

### 파일 권한 오류

**증상:** "Permission denied" 에러

**해결:**
```bash
# 에이전트 파일들의 권한 확인 및 수정
chmod 644 ~/.claude/agents/*.md

# 또는 디렉토리 전체 권한 수정
chmod 755 ~/.claude/agents/
chmod 644 ~/.claude/agents/*
```

### 특정 에이전트만 작동 안 함

**증상:** 일부 에이전트만 "command not found"

**해결:**
```bash
# 파일 이름과 정확히 일치하는지 확인
ls -la ~/.claude/agents/ | grep -E "(prometheus|momus|metis)"

# 파일이 손상되었으면 다시 복사
cp .claude/agents/prometheus.md ~/.claude/agents/
```

## 심화 설정

### 커스텀 에이전트 추가

새로운 특화 에이전트를 추가하려면:

```bash
# 새 에이전트 파일 생성
cat > ~/.claude/agents/my-specialist.md << 'EOF'
# 🎯 My Specialist - 특화된 역할

## 역할
설명...

## 시스템 프롬프트
You are My Specialist...

## 사용 커맨드
/my-specialist [request]
EOF
```

### 프로젝트별 에이전트 설정

특정 프로젝트에서만 특화된 에이전트를 사용하려면:

```bash
# 프로젝트 루트의 .claude/agents/ 디렉토리 사용
# Claude Code가 프로젝트 로컬 agents를 우선순위로 로드함
mkdir -p .claude/agents
cp ~/.claude/agents/prometheus.md .claude/agents/
```

## 업데이트 & 유지보수

### 에이전트 업데이트

새로운 버전의 에이전트가 출시되면:

```bash
# 방법 1: 심링크 사용 시 (자동)
cd your-project-repo
git pull  # 최신 에이전트 받기
# 자동으로 ~/.claude/agents에 반영됨

# 방법 2: 직접 복사 시
cp .claude/agents/*.md ~/.claude/agents/
```

### 에이전트 커스터마이징

특정 에이전트의 동작을 수정하려면:

```bash
# 에이전트 파일 직접 수정
nano ~/.claude/agents/prometheus.md

# 또는 프로젝트 로컬 버전 생성
nano .claude/agents/prometheus.md  # 이 버전이 우선 사용됨
```

### 버전 관리

에이전트 버전 관리 (선택사항):

```bash
# 백업 생성
cp -r ~/.claude/agents ~/.claude/agents.backup.v1

# 변경 사항 추적
git add .claude/agents/
git commit -m "feat: Update agents - improve Prometheus planning"
```

## 다음 단계

설치가 완료되었으면:

1. **ORCHESTRATOR_GUIDE.md** 읽기 - 사용 방법 학습
2. **간단한 프로젝트**에서 테스트 - 시스템 이해하기
3. **실제 프로젝트**에 적용 - 생산성 향상

## 지원 & 피드백

설치 중 문제가 발생하면:

1. 위의 "문제 해결" 섹션 확인
2. Claude Code 재시작
3. `.claude/agents/` 파일들이 올바른지 재확인
4. 각 에이전트의 마크다운 파일 문법 확인

Happy building! 🚀
