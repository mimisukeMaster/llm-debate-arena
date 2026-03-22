# VOICEVOX公式のCPU版Ubuntuイメージをベースにする
FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest

USER root

# URLからダウンロードするためcurlをインストール
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Minicondaをダウンロードしてインストール
RUN curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda && \
    rm Miniconda3-latest-Linux-x86_64.sh

# MinicondaのPythonをシステムの標準として使えるようにパスを通す
ENV PATH="/opt/conda/bin:$PATH"

WORKDIR /app

COPY requirements.txt .

# 独立環境の最新pipを使ってパッケージをインストール
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY start.sh .

RUN chmod +x start.sh

EXPOSE 7860

CMD ["./start.sh"]