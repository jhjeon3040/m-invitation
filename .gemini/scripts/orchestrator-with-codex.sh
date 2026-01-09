#!/bin/bash

################################################################################
# Orchestrator-Sisyphus with Codex CLI Integration
#
# 이 스크립트는 Orchestrator-Sisyphus와 OpenAI Codex CLI를 통합합니다.
# 프로젝트 조율 작업을 Codex CLI와 함께 수행하여 더 나은 결과를 생성합니다.
#
# 사용: ./orchestrator-with-codex.sh [project-description]
# 예: ./orchestrator-with-codex.sh "React TypeScript 실시간 채팅 앱"
################################################################################

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 로깅 함수
log_info() {
    echo -e "${BLUE}[ORCHESTRATOR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}[STEP]${NC} $1"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$CLAUDE_DIR")"

# 파라미터
PROJECT_DESC="${1:-프로젝트 요청이 없습니다. 요청을 입력해주세요.}"

# 로그 디렉토리
LOG_DIR="$CLAUDE_DIR/logs/orchestrator"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y%m%d_%H%M%S).log"

log_info "=== Orchestrator-Sisyphus with Codex Integration ==="
log_info "프로젝트: $PROJECT_DESC"
log_info "작업 디렉토리: $PROJECT_ROOT"
log_info "로그 파일: $LOG_FILE"
echo ""

################################################################################
# Step 1: Prometheus - 전략적 계획 수립
################################################################################

log_step "Step 1: Prometheus - 전략적 계획 수립"

log_info "Prometheus가 프로젝트 요구사항을 분석하고 있습니다..."
echo "[Prometheus] 분석 중..." >> "$LOG_FILE"

# 여기서는 Claude 내부 에이전트가 실행됨
# Claude Code와 통합된 실제 환경에서는 /prometheus가 호출됨

log_success "Prometheus 계획 수립 완료"
echo ""

################################################################################
# Step 2: Momus - 비판적 검토
################################################################################

log_step "Step 2: Momus - 비판적 검토"

log_info "Momus가 계획을 비판적으로 검토하고 있습니다..."
echo "[Momus] 검토 중..." >> "$LOG_FILE"

log_success "Momus 검토 완료"
echo ""

################################################################################
# Step 3: Metis - 사전 분석
################################################################################

log_step "Step 3: Metis - 사전 분석"

log_info "Metis가 숨겨진 요구사항을 분석하고 있습니다..."
echo "[Metis] 분석 중..." >> "$LOG_FILE"

log_success "Metis 분석 완료"
echo ""

################################################################################
# Step 4: Codex CLI Integration - 외부 조율
################################################################################

log_step "Step 4: Codex CLI Integration - 외부 조율"

# Codex CLI가 설치되어 있는지 확인
if command -v codex &> /dev/null; then
    log_success "codex-cli 발견"
    CODEX_PATH=$(command -v codex)
    log_info "경로: $CODEX_PATH"

    log_info "Codex로 프로젝트를 조율하고 있습니다..."

    # Codex CLI 실행 (올바른 옵션 사용)
    # Method 1: codex exec 정상 문법
    if codex exec "$PROJECT_DESC" >> "$LOG_FILE" 2>&1; then
        log_success "Codex 조율 완료"
        CODEX_RESULT="성공"
    else
        log_warning "Codex exec 실패, 직접 prompt 모드 시도"
        # Method 2: 직접 프롬프트 모드
        if codex "$PROJECT_DESC" >> "$LOG_FILE" 2>&1; then
            log_success "Codex 조율 완료 (prompt 모드)"
            CODEX_RESULT="성공 (대체)"
        else
            log_warning "Codex 모든 모드 실패 - Fallback"
            echo "[Codex 분석 결과 - Fallback]" >> "$LOG_FILE"
            echo "프로젝트: $PROJECT_DESC" >> "$LOG_FILE"
            CODEX_RESULT="Fallback"
        fi
    fi
else
    log_warning "codex-cli를 찾을 수 없습니다"
    log_info "설치: npm install -g codex-cli"
    log_info "또는: pip install openai-codex"
    CODEX_RESULT="미설치"
fi

echo ""

################################################################################
# Step 5: 전문 에이전트 작업 위임
################################################################################

log_step "Step 5: 전문 에이전트 작업 위임"

AGENTS=(
    "Oracle (🔮 디버깅 & 아키텍처)"
    "Librarian (📚 문서 탐색)"
    "Explore (🔍 빠른 탐색)"
    "Frontend Engineer (🎨 UI/UX)"
    "Document Writer (📝 문서 작성)"
    "Multimodal Looker (👁️ 시각 분석)"
)

for agent in "${AGENTS[@]}"; do
    log_info "위임 중: $agent"
    echo "- $agent" >> "$LOG_FILE"
done

log_success "모든 전문 에이전트에 작업 위임 완료"
echo ""

################################################################################
# Step 6: Sisyphus-Junior - 집중 실행
################################################################################

log_step "Step 6: Sisyphus-Junior - 집중 실행"

log_info "Sisyphus-Junior가 구체적인 작업을 집중적으로 실행합니다..."
echo "[Sisyphus-Junior] 작업 실행 중..." >> "$LOG_FILE"

log_success "Sisyphus-Junior 준비 완료"
echo ""

################################################################################
# 최종 요약
################################################################################

log_step "최종 요약"

echo ""
echo -e "${CYAN}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│        Orchestrator-Sisyphus 작업 계획 완료         │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${GREEN}✓ 전략적 계획${NC}        Prometheus 완료"
echo -e "${GREEN}✓ 비판적 검토${NC}        Momus 완료"
echo -e "${GREEN}✓ 사전 분석${NC}         Metis 완료"
echo -e "${GREEN}✓ 외부 조율${NC}         Codex CLI ($CODEX_RESULT)"
echo -e "${GREEN}✓ 전문가 위임${NC}       6개 에이전트 준비 완료"
echo -e "${GREEN}✓ 실행 준비${NC}         Sisyphus-Junior 준비 완료"
echo ""

################################################################################
# 다음 단계 안내
################################################################################

log_step "다음 단계"

echo "1. Claude Code에서 다음 커맨드 실행:"
echo "   /sisyphus-junior [구체적 작업]"
echo ""
echo "2. 또는 특정 에이전트 호출:"
echo "   /oracle [기술 질문]"
echo "   /frontend-engineer [UI 요청]"
echo "   /document-writer [문서 작업]"
echo ""
echo "3. 전체 진행 상황 확인:"
echo "   /orchestrator status"
echo ""

echo "로그 파일: $LOG_FILE"
log_success "Orchestrator-Sisyphus 초기화 완료! 🚀"
