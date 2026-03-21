import requests

# OpenRouterのAPIからモデル一覧を取得
response = requests.get("https://openrouter.ai/api/v1/models")
data = response.json()

print("--- 現在利用可能な OpenRouter の無料モデル一覧 ---")
for model in data.get("data", []):
    # IDに ":free" が含まれるものだけを抽出
    if ":free" in model["id"]:
        print(model["id"])