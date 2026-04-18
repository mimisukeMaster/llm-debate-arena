# VOICEVOX公式のCPU版Ubuntuイメージをベースにする
FROM voicevox/voicevox_engine:cpu-ubuntu20.04-0.20.0

USER root

# URLからダウンロードするためcurlをインストール
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# VOICEVOXコア ディレクトリの存在確認とキャッシュの初期化
RUN if [ ! -d "/opt/voicevox_engine/model" ]; then \
      echo "VOICEVOX model directory not found, attempting to initialize..."; \
      mkdir -p /opt/voicevox_engine/model; \
    fi && \
    ls -la /opt/voicevox_engine/ || echo "VOICEVOX directory structure:"

# VOICEVOXエンジン側のPython依存を先に一括インストール
# （run.pyフォールバック時の ModuleNotFoundError 連鎖を防ぐ）
RUN if [ -f /opt/voicevox_engine/requirements.txt ]; then \
      /opt/python/bin/python3 -m pip install --no-cache-dir -r /opt/voicevox_engine/requirements.txt; \
    elif [ -f /opt/voicevox_engine/pyproject.toml ]; then \
      /opt/python/bin/python3 -m pip install --no-cache-dir /opt/voicevox_engine; \
    else \
      echo "VOICEVOX dependency manifest not found; skip preinstall"; \
    fi

# VOICEVOXランタイムのPython環境にAPI依存を追加する
RUN /opt/python/bin/python3 -m pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY start.sh .
COPY voicevox_characters.json .

RUN chmod +x start.sh

EXPOSE 7860

CMD ["./start.sh"]