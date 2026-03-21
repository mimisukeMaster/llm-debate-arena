import os
from openai import OpenAI
from dotenv import load_dotenv

# .envから環境変数を読み込む
load_dotenv()

# GroqのAPIエンドポイントに向ける
groq_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

print("--- 現在利用可能な Groq のモデル一覧 ---")
models = groq_client.models.list()

# 取得したモデルIDをアルファベット順に表示
for m in sorted(models.data, key=lambda x: x.id):
    print(m.id)