#!/bin/bash

# VOICEVOXエンジンをバックグラウンドで起動
/opt/voicevox_engine/run &

# VOICEVOXが立ち上がるまで数秒待機
sleep 5

# FastAPIを起動 (ポート7860)
uvicorn main:app --host 0.0.0.0 --port 7860