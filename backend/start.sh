#!/bin/bash

# VOICEVOXエンジンをバックグラウンドで起動
/opt/voicevox_engine/run &

# VOICEVOXが立ち上がるまで疎通確認しながら待機
VOICEVOX_URL="${VOICEVOX_URL:-http://127.0.0.1:50021}"
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