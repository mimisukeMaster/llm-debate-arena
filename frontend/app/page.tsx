"use client";

import { useState } from "react";

// メッセージの型定義
type Message = {
  role: string;
  content: string;
};

export default function Home() {
  const [topic, setTopic] = useState("AIは人類の仕事を奪うべきか？");
  const [history, setHistory] = useState<Message[]>([]);
  const [nextSpeaker, setNextSpeaker] = useState("A");
  const [isLoading, setIsLoading] = useState(false);
  const [judgeComment, setJudgeComment] = useState("");
  
  // --- 追加1: トレンド取得中の状態 ---
  const [isFetchingTrend, setIsFetchingTrend] = useState(false);

  // --- 追加2: トレンドを取得する関数 ---
  const handleFetchTrend = async () => {
    setIsFetchingTrend(true);
    try {
      const res = await fetch("http://localhost:8000/api/trend");
      if (!res.ok) throw new Error("トレンド取得失敗");
      const data = await res.json();
      setTopic(data.topic);
    } catch (error) {
      console.error(error);
      alert("トレンドの取得に失敗しました。FastAPIサーバーを確認してください。");
    } finally {
      setIsFetchingTrend(false);
    }
  };

  const handleNextTurn = async () => {
    if (!topic) {
      alert("テーマを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/debate/next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          history: history,
          next_speaker: nextSpeaker,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // 新しい発言を履歴に追加
      setHistory((prev) => [
        ...prev,
        { role: data.speaker, content: data.content },
      ]);
      setJudgeComment(data.judge_comment);
      
      // 次の話者を交代
      setNextSpeaker(data.speaker === "A" ? "B" : "A");

      // 音声の再生
      if (data.audio_base64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
        audio.play();
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("通信エラーが発生しました。FastAPIサーバーが起動しているか確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー＆テーマ入力 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-400">LLM Debate Arena</h1>
          
          {/* 追加3: 隙間をgap-4からgap-2に縮め、トレンドボタンを真ん中に挿入 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={history.length > 0}
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="テーマを入力、または自動取得..."
            />
            
            {/* ここからトレンドボタン */}
            <button
              onClick={handleFetchTrend}
              disabled={history.length > 0 || isFetchingTrend}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-bold transition-colors whitespace-nowrap"
            >
              {isFetchingTrend ? "取得中..." : "トレンドから生成"}
            </button>
            {/* ここまで */}

            <button
              onClick={handleNextTurn}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold transition-colors flex items-center justify-center min-w-40"
            >
              {isLoading ? "思考中..." : history.length === 0 ? "ディベート開始" : "次のターンへ"}
            </button>
          </div>
        </div>

        {/* ジャッジ(Gemini)の指示 */}
        {judgeComment && (
          <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-lg">
            <p className="text-sm text-purple-300 font-bold mb-1">モデレーターからのメッセージ</p>
            <p className="text-purple-100">{judgeComment}</p>
          </div>
        )}

        {/* チャット履歴エリア */}
        <div className="space-y-6">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "A" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] p-5 rounded-2xl ${
                  msg.role === "A"
                    ? "bg-emerald-900/50 border border-emerald-500/50 rounded-tl-none"
                    : "bg-rose-900/50 border border-rose-500/50 rounded-tr-none"
                }`}
              >
                <div className="font-bold text-sm mb-2 text-gray-400">
                  {msg.role === "A" ? "ずんだもん（Qwen3）" : "四国めたん（Llama3）"}
                </div>
                <div className="leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}