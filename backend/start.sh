#!/bin/bash

# VOICEVOXエンジンをバックグラウンドで起動
VOICEVOX_HOST="${VOICEVOX_HOST:-127.0.0.1}"
VOICEVOX_PORT="${VOICEVOX_PORT:-50021}"

if [ -f "/opt/voicevox_engine/run" ]; then
  # 公式配布の実行バイナリ（依存を自己完結しているため最優先）
  /opt/voicevox_engine/run --host "${VOICEVOX_HOST}" --port "${VOICEVOX_PORT}" &
elif [ -f "/opt/voicevox_engine/run.py" ]; then
  # run バイナリが無い場合のフォールバック
  /opt/python/bin/python3 /opt/voicevox_engine/run.py --host "${VOICEVOX_HOST}" --port "${VOICEVOX_PORT}" &
else
  echo "VOICEVOX start entry not found: /opt/voicevox_engine/run(.py)"
  exit 1
fi

# VOICEVOXが立ち上がるまで疎通確認しながら待機
VOICEVOX_URL="${VOICEVOX_URL:-http://${VOICEVOX_HOST}:${VOICEVOX_PORT}}"
VOICEVOX_VERSION_URL="${VOICEVOX_URL%/}/version"

echo "Waiting VOICEVOX... (${VOICEVOX_VERSION_URL})"
for ((i=1; i<=30; i++)); do
  if curl -fsS "${VOICEVOX_VERSION_URL}" >/dev/null 2>&1; then
    echo "VOICEVOX is ready."
    break
  fi
  echo "VOICEVOX not ready yet (${i}/30)."
  sleep 2
done

# 最終チェック（ここで落とせばコンテナ再起動されやすい）
curl -fsS "${VOICEVOX_VERSION_URL}" >/dev/null 2>&1 || { echo "VOICEVOX failed to start."; exit 1; }

# FastAPIを起動 (ポート7860)
uvicorn main:app --host 0.0.0.0 --port 7860