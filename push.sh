#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BRANCH="${BRANCH:-main}"
PAGES_BRANCH="${PAGES_BRANCH:-gh-pages}"
DEPLOY_PAGES=1
ASSUME_YES=0
MESSAGE=""

usage() {
  cat <<'EOF'
用法：./push.sh [选项]

把改动提交并推送到 GitHub；默认随后构建 dist/ 并发布到 gh-pages。

选项：
  -m, --message <说明>  提交说明（默认自动生成）
      --no-pages        只推送源码，不构建、不发布 gh-pages
  -y, --yes             不再询问，直接执行
  -h, --help            显示本帮助

环境变量：BRANCH（默认 main）、PAGES_BRANCH（默认 gh-pages）
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      [[ $# -ge 2 && -n "${2:-}" ]] || { echo "缺少提交说明。" >&2; exit 1; }
      MESSAGE="$2"
      shift 2
      ;;
    --no-pages)
      DEPLOY_PAGES=0
      shift
      ;;
    -y|--yes)
      ASSUME_YES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "未知参数：$1" >&2
      echo ""
      usage >&2
      exit 1
      ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "当前目录不是 Git 仓库。" >&2
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo "当前分支是 $CURRENT_BRANCH，脚本只从 $BRANCH 推送。" >&2
  echo "请先切换：git switch $BRANCH" >&2
  exit 1
fi

if [[ "$DEPLOY_PAGES" == "1" ]] && ! command -v npm >/dev/null 2>&1; then
  echo "找不到 npm，无法构建站点。可以加 --no-pages 只推送源码。" >&2
  exit 1
fi

echo "同步远端信息…"
git fetch origin --prune

if [[ -z "$MESSAGE" ]]; then
  MESSAGE="更新站点内容 $(date '+%Y-%m-%d %H:%M')"
fi

HAS_CHANGES=0
if [[ -n "$(git status --porcelain)" ]]; then
  HAS_CHANGES=1
fi

AHEAD=0
if git rev-parse --verify --quiet "origin/$BRANCH" >/dev/null; then
  AHEAD="$(git rev-list --count "origin/$BRANCH..$BRANCH")"
fi

echo ""
echo "  合肥「第一」音游祭 · 推送到 GitHub"
echo "  ─────────────────────────────────"
echo "  分支：        $BRANCH"

if [[ "$HAS_CHANGES" == "1" ]]; then
  git status --short
  echo "  改动：        将提交为「$MESSAGE」"
else
  echo "  改动：        无"
fi

echo "  待推送提交：  $AHEAD 个"
if [[ "$DEPLOY_PAGES" == "1" ]]; then
  echo "  发布：        npm run build → $PAGES_BRANCH"
else
  echo "  发布：        跳过（--no-pages）"
fi
echo "  ─────────────────────────────────"
echo ""

if [[ "$HAS_CHANGES" == "0" && "$AHEAD" == "0" && "$DEPLOY_PAGES" == "0" ]]; then
  echo "没有需要推送的内容。"
  exit 0
fi

if [[ "$ASSUME_YES" != "1" ]]; then
  read -r -p "确认执行？[y/N] " reply
  case "$reply" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "已取消。"; exit 1 ;;
  esac
fi

if [[ "$HAS_CHANGES" == "1" ]]; then
  git add -A
  git commit -m "$MESSAGE"
  AHEAD="$((AHEAD + 1))"
fi

if [[ "$AHEAD" -gt 0 ]]; then
  echo "推送 $BRANCH…"
  git push origin "$BRANCH"
else
  echo "$BRANCH 没有新的提交，跳过推送。"
fi

if [[ "$DEPLOY_PAGES" != "1" ]]; then
  echo "完成：源码已同步，未发布 gh-pages。"
  exit 0
fi

echo "构建站点…"
npm run build

if [[ ! -f dist/index.html ]]; then
  echo "构建产物缺少 dist/index.html，中止发布。" >&2
  exit 1
fi

if ! git rev-parse --verify --quiet "origin/$PAGES_BRANCH" >/dev/null; then
  echo "远端没有 $PAGES_BRANCH 分支，无法发布。" >&2
  echo "请先创建该分支并推送后再运行。" >&2
  exit 1
fi

WORKTREE=""
cleanup() {
  if [[ -n "$WORKTREE" ]]; then
    git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
    rm -rf "$WORKTREE"
    WORKTREE=""
  fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM

WORKTREE="$(mktemp -d "${TMPDIR:-/tmp}/otogefes-pages.XXXXXX")"
git worktree add --detach "$WORKTREE" "origin/$PAGES_BRANCH" >/dev/null

rsync -a --delete \
  --exclude '.git' \
  --exclude '.DS_Store' \
  dist/ "$WORKTREE/"

(
  cd "$WORKTREE"
  if [[ -z "$(git status --porcelain)" ]]; then
    echo "gh-pages 内容没有变化，跳过发布。"
    exit 0
  fi
  git add -A
  git commit -m "部署：$MESSAGE" >/dev/null
  git push origin "HEAD:$PAGES_BRANCH"
)

echo ""
echo "完成：源码已推送至 $BRANCH，构建产物已发布至 $PAGES_BRANCH。"
echo "GitHub Pages 生效通常需要几十秒。"
