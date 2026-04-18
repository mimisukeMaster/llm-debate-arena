# VOICEVOX公式のCPU版Ubuntuイメージをベースにする
FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest

USER root

# URLからダウンロードするためcurlをインストール
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# VOICEVOXランタイムのPython環境にAPI依存を追加する
RUN /opt/python/bin/python3 -m pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY start.sh .
COPY voicevox_characters.json .

RUN chmod +x start.sh

EXPOSE 7860

CMD ["./start.sh"]