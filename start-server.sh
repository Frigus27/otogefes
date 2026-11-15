#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

SITE_HOST="${SITE_HOST:-127.0.0.1}"
SITE_PORT="${SITE_PORT:-4400}"
SIM_PORT="${SIM_PORT:-4410}"
START_SIMULATOR=1

if [[ "${1:-}" == "--no-simulator" ]]; then
  START_SIMULATOR=0
fi

port_in_use() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

if ! command -v node >/dev/null 2>&1; then
  echo "找不到 Node.js，请先安装 Node.js 22.22 或更高版本。" >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "未检测到依赖，正在安装…"
  npm install
fi

if port_in_use "$SITE_PORT"; then
  echo "端口 $SITE_PORT 已被占用，无法启动站点。" >&2
  echo "可以这样换端口：SITE_PORT=4401 ./start-server.sh" >&2
  exit 1
fi

SIM_PID=""
cleanup() {
  if [[ -n "$SIM_PID" ]] && kill -0 "$SIM_PID" 2>/dev/null; then
    kill "$SIM_PID" 2>/dev/null || true
    wait "$SIM_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo ""
echo "  合肥「第一」音游祭 · 本地开发环境"
echo "  ─────────────────────────────────"
echo "  站点：      http://$SITE_HOST:$SITE_PORT/"
echo "  榜单：      http://$SITE_HOST:$SITE_PORT/ranking/"

if [[ "$START_SIMULATOR" == "1" ]]; then
  if command -v python3 >/dev/null 2>&1 && [[ -d "$ROOT_DIR/preview/mobile" ]]; then
    if port_in_use "$SIM_PORT"; then
      echo "  手机模拟器： 跳过（端口 $SIM_PORT 已被占用）"
    else
      python3 -m http.server "$SIM_PORT" --bind "$SITE_HOST" --directory "$ROOT_DIR/preview/mobile" >/dev/null 2>&1 &
      SIM_PID=$!
      echo "  手机模拟器：  http://$SITE_HOST:$SIM_PORT/?site=http://$SITE_HOST:$SITE_PORT"
    fi
  else
    echo "  手机模拟器：  跳过（需要 python3）"
  fi
fi

echo "  ─────────────────────────────────"
echo "  按 Ctrl+C 停止全部服务"
echo ""

npm run dev -- --host "$SITE_HOST" --port "$SITE_PORT"
