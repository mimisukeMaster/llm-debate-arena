import os
import httpx
import base64
import urllib.request
import xml.etree.ElementTree as ET
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
from google import genai
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

app = FastAPI(title="LLM Debate Arena API")

# フロント/バックでの連携を行うためCORSを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# クライアントの初期化
groq_client = AsyncOpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

openrouter_client = AsyncOpenAI(
    api_key=os.environ.get("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

gemini_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class DebateRequest(BaseModel):
    topic: str
    history: list[dict]
    next_speaker: str

# 音声合成のエンドポイント
async def generate_audio(text: str, speaker_id: int) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        # クエリ作成
        query_res = await client.post(
            "http://127.0.0.1:50021/audio_query",
            params={"text": text, "speaker": speaker_id, "speedScale" : 1.5 if speaker_id == 3 else 1.0}
        )
        query_res.raise_for_status()
        query_data = query_res.json()

        # WAV音声データを生成
        synth_res = await client.post(
            "http://127.0.0.1:50021/synthesis",
            params={"speaker": speaker_id},
            json=query_data
        )
        synth_res.raise_for_status()

        # WAVデータをBase64エンコードして返す
        return base64.b64encode(synth_res.content).decode('utf-8')

# ディベートの次の発言を生成するエンドポイント
@app.post("/api/debate/next")
async def generate_next_turn(request: DebateRequest):
    # ジャッジによる現状分析
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in request.history])
    if not history_text:
        history_text = "（まだ発言はありません）"

    judge_prompt = f"""
    テーマ: {request.topic}
    これまでの議論:
    {history_text}
    
    あなたは中立なジャッジです。次に発言する {request.next_speaker} が、
    相手の意見のどの部分に論理的な穴があるか指摘し、どう反論すべきか、
    100文字程度で簡潔に指示を出してください。最初のターンであれば、議論の口火を切るよう指示してください。
    """
    
    judge_response = await gemini_client.aio.models.generate_content(
        model='gemini-flash-latest',
        contents=judge_prompt
    )
    judge_instruction = judge_response.text

    # 手番のLLMに発言を生成させる
    speaker_prompt = f"""
    テーマ: {request.topic}
    あなたは {request.next_speaker} の立場でディベートをしています。
    ジャッジからの助言: {judge_instruction}
    
    この助言を必ず参考にし、これまでの議論を繰り返さず、新しい視点から150文字以内で鋭く主張または反論してください。
    """

    if request.next_speaker == "A":
        # ディベーターA(Zhipu AIのGLM): OpenRouter経由
        response = await openrouter_client.chat.completions.create(
            model="z-ai/glm-4.5-air:free",
            messages=[{"role": "user", "content": speaker_prompt}],
            temperature=0.7
        )
    else:
        # ディベーターB(Llama 3): Groq経由
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": speaker_prompt}],
            temperature=0.7
        )
        
    next_argument = response.choices[0].message.content

    # Aは「ずんだもん(3)」、Bは「四国めたん(2)」の声
    speaker_id = 3 if request.next_speaker == "A" else 2
    audio_base64 = await generate_audio(next_argument, speaker_id)

    return {
        "speaker": request.next_speaker,
        "content": next_argument,
        "judge_comment": judge_instruction,
        "audio_base64": audio_base64
    }

# ディベートのテーマを決めるエンドポイント
@app.get("/api/trend")
async def get_trending_topic():
    try:
        # GoogleニュースのRSSから最新の見出しを10つ取得
        url = "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        headlines = [item.find('title').text for item in root.findall('.//item')[:10]]
        
        # ディベートのテーマを考案させる
        prompt = f"""
        以下の最新ニュースの見出しを参考に、意見が真っ二つに割れて白熱した議論ができそうなディベートのテーマを「1つ」だけ作成してください。
        出力は余計な説明を省き、40文字以内でテーマの文字列のみ（例：〇〇は規制されるべきか？、〇〇は廃止すべきか？、◯◯は評価されるべきか？など）としてください。
        
        最新ニュース見出し:
        {', '.join(headlines)}
        """
        
        response = await gemini_client.aio.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        return {"topic": response.text.strip()}

    except Exception as e:
        print(f"トレンド取得エラー: {e}")
        return {"topic": "現代社会におけるSNSの匿名性は廃止すべきか？"} # エラー時のフォールバック