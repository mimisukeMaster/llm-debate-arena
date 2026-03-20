# LLM Debate Arena

[<img src="https://img.shields.io/badge/issues-welcome-green">](https://github.com/mimisukeMaster/llm-debate-arena/issues)
[<img src="https://img.shields.io/badge/PRs-welcome-salmon?logo=git">](https://github.com/mimisukeMaster/llm-debate-arena/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<img src="https://img.shields.io/badge/deployed%20to-Vercel-black?logo=vercel">
<img src="https://img.shields.io/badge/deployed%20to-Oracle Cloud-eb3f3d?logo=oracle">
<img src="https://img.shields.io/github/repo-size/mimisukeMaster/llm-debate-arena?logo=gitlfs&color=ff69b4">


LLM Debate Arenaは、異なるアーキテクチャを持つ複数の大規模言語モデル（LLM）が、指定されたテーマについてディベートを行うWebアプリケーションです。

モデレーター役のLLMがコンテキストを解釈して議論の方向性を管理し、各LLMの発言はVOICEVOXを用いてリアルタイムに音声合成されます。

## Features

* **Multi-LLM Debate**: 異なるプロバイダのAPI（Groq, OpenRouter）を利用し、複数モデル（GLM4.5, Llama3.3 等）による議論を実行。
* **AI Moderator**: Geminiによるコンテキスト分析と、各ディベーターへのプロンプト指示。
* **Real-time TTS**: VOICEVOXエンジンによるテキストの音声化とフロントエンドでの非同期再生。
* **Auto Trend Fetching**: GoogleニュースのRSSから最新の見出しを取得し、Geminiを利用してディベートテーマを自動生成。

## Tech Stack

### Frontend
- フレームワーク: Next.js
- 言語: TypeScript
- スタイリング: Tailwind CSS

### Backend
- フレームワーク: FastAPI
- LLM連携: `google-genai` (Gemini Flash Latest), `openai` SDK (接続先はGroq APIとOpenRouter API)
- 音声合成: VOICEVOX Engine

### Infrastructure (Planned)
- フロントエンド基盤: Vercel
- バックエンド基盤: Oracle Cloud Infrastructure (OCI)
- コンテナ化: Docker, Docker Compose

## Getting Started

ローカル環境でのセットアップ手順です。

### Requirements
- Node.js (v18+)
- Python (3.11+)
- VOICEVOX デスクトップ版
- Gemini, Groq, OpenRouterのAPIキー

### 1. Clone the repository
```bash
git clone https://github.com/mimisukeMaster/llm-debate-arena.git
cd llm-debate-arena
```

### 2. Backend Setup

Pythonの仮想環境（venvまたはconda）を作成し、その中で依存関係をインストールします。

```bash
pip install fastapi uvicorn openai google-genai pydantic python-dotenv httpx
```

プロジェクトルートに `.env` ファイルを作成し、APIキーを設定します。

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

VOICEVOXソフトを起動し、[`http://127.0.0.1:50021`](http://127.0.0.1:50021) にてAPIを受け付けさせます。 

FastAPIサーバーを起動します。

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

別のターミナルを開き、フロントエンドの依存関係をインストールして起動します。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで [`http://localhost:3000`](http://localhost:3000) にアクセスして動作を確認します。

## Roadmap

  - [x] ローカルでの挙動実装
      - [x] FastAPIによる複数LLMのAPI統合
      - [x] VOICEVOXエンジン連携とBase64音声エンコード
      - [x] Next.js + Tailwind CSSによるUI実装
      - [x] RSSからのトレンドテーマ自動抽出エンドポイント実装
  - [ ] クラウドへのデプロイ
      - [ ] Vercelへのフロントエンドデプロイ
      - [ ] バックエンド（FastAPI + VOICEVOX）のDockerコンテナ化
      - [ ] Oracle Cloud (OCI) ARMインスタンスへの本番デプロイ
  - [ ] ブラッシュアップ
      - [ ] 話者（音声モデル）の動的選択機能の実装
      - [ ] ディベート履歴の永続化（DB連携）
      -  etc...

## Author
みみすけ名人 mimisukeMaster


[ポートフォリオ](https://mimisukemaster.vercel.app) / [X](https://x.com/mimisukeMaster) / [ArtStation](https://www.artstation.com/mimisukemaster)
## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.