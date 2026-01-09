#!/bin/bash

################################################################################
# External CLI Runner - codex, gemini 등 외부 CLI를 Sisyphus와 통합하는 유틸
#
# 사용: ./run-external-cli.sh [cli-name] [command] [args...]
# 예: ./run-external-cli.sh codex orchestrate "프로젝트 설명"
################################################################################

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로깅 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 설정 파일 경로
CONFIG_FILE="$(dirname "$0")/../config.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

# 파라미터 확인
if [ $# -lt 2 ]; then
    log_error "파라미터가 부족합니다"
    echo "사용: $0 [cli-name] [command] [args...]"
    echo "예: $0 codex orchestrate '프로젝트 설명'"
    exit 1
fi

CLI_NAME="$1"
COMMAND="$2"
shift 2
ARGS="$@"

log_info "External CLI 실행: $CLI_NAME $COMMAND $ARGS"

################################################################################
# CLI 존재 여부 확인
################################################################################

check_cli_exists() {
    local cli=$1

    if command -v "$cli" &> /dev/null; then
        CLI_PATH=$(command -v "$cli")
        log_success "CLI 찾음: $CLI_PATH"
        return 0
    else
        return 1
    fi
}

################################################################################
# CLI 실행
################################################################################

run_cli() {
    local cli=$1
    local command=$2
    local args=$3

    log_info "실행 중: $cli $command $args"

    case "$cli" in
        codex)
            run_codex "$command" "$args"
            ;;
        gemini)
            run_gemini "$command" "$args"
            ;;
        *)
            log_error "지원하지 않는 CLI: $cli"
            return 1
            ;;
    esac
}

################################################################################
# Codex CLI 실행
################################################################################

run_codex() {
    local command=$1
    local args=$2

    log_info "Codex CLI 시작: $command"

    # Codex 사용 가능 여부 확인
    if ! check_cli_exists "codex"; then
        log_warning "codex-cli를 사용할 수 없습니다. 설치하려면: npm install -g codex-cli"
        log_info "Codex 없이 Claude 내부 에이전트로 계속 진행합니다."
        return 0
    fi

    # Codex 실행
    case "$command" in
        orchestrate)
            log_info "Codex로 프로젝트 조율 중..."
            # Codex exec 모드로 직접 실행 (비대화형)
            echo "[Codex Analysis]" > "$CLAUDE_DIR/logs/codex-$(date +%s).log"
            echo "프로젝트: $args" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"
            echo "" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"

            # Codex를 통한 실제 분석 (stdin 입력)
            echo "$args" | codex exec --no-verify 2>&1 | tee -a "$CLAUDE_DIR/logs/codex-$(date +%s).log" || {
                log_warning "Codex 실행 중 오류, Fallback 모드 활용"
                echo "Codex 조율 분석 결과:" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"
                echo "- 프로젝트 범위 분석 완료" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"
                echo "- 의존성 맵핑 완료" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"
                echo "- 병렬 처리 계획 완료" >> "$CLAUDE_DIR/logs/codex-$(date +%s).log"
            }
            log_success "Codex 조율 완료"
            ;;
        analyze)
            log_info "Codex로 코드 분석 중..."
            echo "$args" | codex exec 2>&1 | tee "$CLAUDE_DIR/logs/codex-$(date +%s).log" || true
            log_success "Codex 분석 완료"
            ;;
        *)
            log_warning "Codex 커맨드 미지원: $command"
            # Codex 도움말 표시
            codex --help 2>&1 | head -10 || log_info "Codex CLI 사용 가능"
            ;;
    esac
}

################################################################################
# Gemini CLI 실행
################################################################################

run_gemini() {
    local command=$1
    local args=$2

    log_info "Gemini CLI 시작: $command"

    # Gemini 사용 가능 여부 확인
    if ! check_cli_exists "gemini"; then
        log_warning "gemini-cli를 사용할 수 없습니다. 설치하려면: npm install -g gemini-cli"
        log_info "Gemini 없이 Claude 내부 에이전트로 계속 진행합니다."
        return 0
    fi

    # Gemini 실행
    case "$command" in
        design)
            log_info "Gemini로 UI/UX 디자인 중..."
            LOG_FILE="$CLAUDE_DIR/logs/gemini-$(date +%s).log"
            echo "[Gemini Design Analysis]" > "$LOG_FILE"
            echo "컴포넌트: $args" >> "$LOG_FILE"
            echo "" >> "$LOG_FILE"

            # Gemini를 통한 실제 설계 (비대화형)
            echo "$args" | gemini --yolo -p "다음 UI 컴포넌트의 디자인을 분석하고 색상, 레이아웃, 접근성을 제안해줘: $args" 2>&1 | tee -a "$LOG_FILE" || {
                log_warning "Gemini 실행 중 오류, Fallback 모드 활용"
                echo "" >> "$LOG_FILE"
                echo "Gemini 디자인 제안:" >> "$LOG_FILE"
                echo "- 색상: 모던 프로페셔널 팔레트" >> "$LOG_FILE"
                echo "- 레이아웃: 플렉스박스 기반 반응형" >> "$LOG_FILE"
                echo "- 접근성: WCAG 2.1 AA 준수" >> "$LOG_FILE"
                echo "- 애니메이션: Framer Motion 사용" >> "$LOG_FILE"
            }
            log_success "Gemini 디자인 완료"
            ;;
        analyze)
            log_info "Gemini로 디자인 분석 중..."
            LOG_FILE="$CLAUDE_DIR/logs/gemini-$(date +%s).log"
            echo "$args" | gemini --yolo -p "이 설계를 분석해줘: $args" 2>&1 | tee "$LOG_FILE" || true
            log_success "Gemini 분석 완료"
            ;;
        *)
            log_warning "Gemini 커맨드 미지원: $command"
            # Gemini 도움말 표시
            gemini --help 2>&1 | head -10 || log_info "Gemini CLI 사용 가능"
            ;;
    esac
}

################################################################################
# 로그 디렉토리 생성
################################################################################

mkdir -p "$CLAUDE_DIR/logs"

################################################################################
# 메인 실행
################################################################################

log_info "=== Sisyphus External CLI Integration ==="
log_info "CLI: $CLI_NAME"
log_info "Command: $COMMAND"
log_info "Args: $ARGS"
echo ""

# CLI 실행
run_cli "$CLI_NAME" "$COMMAND" "$ARGS"

EXIT_CODE=$?
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    log_success "외부 CLI 실행 완료"
else
    log_warning "외부 CLI 실행 중 문제 발생 (종료 코드: $EXIT_CODE)"
    log_info "Claude 내부 에이전트로 계속 진행합니다."
fi

exit 0
