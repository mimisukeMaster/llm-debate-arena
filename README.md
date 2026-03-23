# LLM Debate Arena

[<img src="https://img.shields.io/badge/issues-welcome-green">](https://github.com/mimisukeMaster/llm-debate-arena/issues)
[<img src="https://img.shields.io/badge/PRs-welcome-salmon?logo=git">](https://github.com/mimisukeMaster/llm-debate-arena/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-bb0000.svg)](https://opensource.org/licenses/MIT)
[<img src="https://img.shields.io/badge/deployed%20to-Vercel-000000?logo=vercel&logoColor=white">](https://vercel.com/mimisukemasters-projects/llm-debate-arena)
[<img src="https://img.shields.io/badge/deployed%20to-Hugging_Face_Spaces-FFD21E?logo=huggingface">](https://huggingface.co/spaces/mimisukeMaster/llm-debate-arena/tree/main)
<img src="https://img.shields.io/github/repo-size/mimisukeMaster/llm-debate-arena?logo=gitlfs&color=ff69b4">


LLM Debate Arenaは、複数の大規模言語モデル（LLM）が、指定されたテーマについてディベートを行うWebアプリケーションです。

モデレーター役のLLMがコンテキストを解釈して議論の方向性を管理し、各LLMの発言はVOICEVOXを用いてリアルタイムに音声合成されます。

## Features

- **Multi-LLM Debate**: 異なるプロバイダのAPI（Groq, OpenRouter）を利用し、複数モデル（GLM4.5, Llama3.3 等）による議論を実行。
- **AI Moderator**: Geminiによるコンテキスト分析と、各ディベーターへのプロンプト指示。
- **Real-time TTS**: VOICEVOXエンジンによるテキストの音声化とフロントエンドでの非同期再生。
- **Auto Trend Fetching**: GoogleニュースのRSSから最新の見出しを取得し、Geminiを利用してディベートテーマを自動生成。

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?logo=googlegemini&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?logo=groq&logoColor=white)
![VOICEVOX](https://img.shields.io/badge/VOICEVOX-A4C800?logoColor=white)

### Infrastructure
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face_Spaces-FFD21E?logo=huggingface&logoColor=f0f000)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

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

`backend`直下に `.env` ファイルを作成し、APIキーを設定します。

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

VOICEVOXソフトを起動し、[`http://127.0.0.1:50021`](http://127.0.0.1:50021) にてAPIを受け付けさせます。

FastAPIサーバーを起動します。

```bash
cd backend
uvicorn main:app --reload
```

### 3. Frontend Setup

`frontend`直下に、`.env.local`ファイルを作成し、APIのURLを設定します。
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
新しくターミナルを開き、フロントエンドの依存関係をインストールして起動します。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで [`http://localhost:3000`](https://www.google.com/search?q=http://localhost:3000) にアクセスして動作を確認します。

## Roadmap

  - [x] ローカルでの挙動実装
      - [x] FastAPIによる複数LLMのAPI統合
      - [x] VOICEVOXエンジン連携とBase64音声エンコード
      - [x] Next.js + Tailwind CSSによるUI実装
      - [x] RSSからのトレンドテーマ自動抽出エンドポイント実装
  - [x] クラウドへのデプロイ
      - [x] Vercelへのフロントエンドデプロイ
      - [x] バックエンド（FastAPI + VOICEVOX）のDockerコンテナ化
      - [x] Hugging Face Spaces へのデプロイ
  - [ ] ブラッシュアップ
      - [ ] 話者（音声モデル）の動的選択機能の実装
      - [ ] ディベート履歴の永続化（DB連携）
      - etc...

## Author

みみすけ名人 mimisukeMaster

![portfolio](https://img.shields.io/badge/PORTFOLIO-0066b4)
![X](https://img.shields.io/badge/X-000?logo=x)
![ArtStation](https://img.shields.io/badge/ArtStation-333?logo=artstation&logoColor=13aff0)

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.