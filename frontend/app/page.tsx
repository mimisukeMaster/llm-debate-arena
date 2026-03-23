"use client";

import { useState } from "react";
import { CHARACTERS, type VoicevoxCharacter } from "./characters";

// ============================================================
// 型定義
// ============================================================
type Message = {
  role: string;
  content: string;
  speakerName?: string;
};

// ============================================================
// 定数
// ============================================================
const GENRES = ["総合", "テクノロジー", "エンタメ", "スポーツ", "ビジネス", "科学", "健康", "社会"] as const;
type Genre = typeof GENRES[number];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ============================================================
// サブコンポーネント: タイピングアニメーション
// ============================================================
function TypingDots({ label }: { label: string }) {
  return (
    <div
      className="typing-dots"
      style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px" }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span>●</span><span>●</span><span>●</span>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function Home() {
  const [topic, setTopic]                     = useState("");
  const [history, setHistory]                 = useState<Message[]>([]);
  const [nextSpeaker, setNextSpeaker]         = useState("A");
  const [isLoading, setIsLoading]             = useState(false);
  const [judgeComment, setJudgeComment]       = useState("");
  const [isFetchingTrend, setIsFetchingTrend] = useState(false);
  const [selectedGenre, setSelectedGenre]     = useState<Genre>("総合");
  const [speakerAId, setSpeakerAId]           = useState(3);
  const [speakerBId, setSpeakerBId]           = useState(2);


  // ============================================================
  // トレンド取得
  // ============================================================
  const handleFetchTrend = async () => {
    setIsFetchingTrend(true);
    try {
      const res = await fetch(`${API_URL}/api/trend?genre=${encodeURIComponent(selectedGenre)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTopic(data.topic);
    } catch {
      alert("トレンドの取得に失敗しました。FastAPIサーバーを確認してください。");
    } finally {
      setIsFetchingTrend(false);
    }
  };

  // ============================================================
  // ディベート次ターン
  // ============================================================
  const handleNextTurn = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/debate/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          history,
          next_speaker: nextSpeaker,
          speaker_a_id: speakerAId,
          speaker_b_id: speakerBId,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHistory((prev) => [...prev, { role: data.speaker, content: data.content, speakerName: data.speaker_name }]);
      setJudgeComment(data.judge_comment);
      setNextSpeaker(data.speaker === "A" ? "B" : "A");
      if (data.audio_base64) {
        new Audio(`data:audio/wav;base64,${data.audio_base64}`).play();
      }
    } catch (e) {
      console.error(e);
      alert("通信エラーが発生しました。FastAPIサーバーが起動しているか確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const debateStarted = history.length > 0;
  const canStart      = topic.trim().length > 0;

  const speakerAName = CHARACTERS.find((c) => c.id === speakerAId)?.name ?? "?";
  const speakerBName = CHARACTERS.find((c) => c.id === speakerBId)?.name ?? "?";
  const charA = CHARACTERS.find((c) => c.id === speakerAId);
  const charB = CHARACTERS.find((c) => c.id === speakerBId);
  const colorA   = charA?.color   ?? "#1d7a48";
  const bgColorA = charA?.bgColor ?? "#dff4ea";
  const colorB   = charB?.color   ?? "#7340b8";
  const bgColorB = charB?.bgColor ?? "#ede0ff";

  // ============================================================
  // レンダリング
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ===== ヘッダー ===== */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 40px",
      }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}>
          <div style={{
            width: 6,
            height: 32,
            background: "var(--accent)",
            borderRadius: 3,
            flexShrink: 0,
          }} />
          <div>
            <h1 style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              LLM Debate Arena
            </h1>
            <p style={{
              margin: "3px 0 0",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}>
              AI-powered multi-model debate simulator
            </p>
          </div>
        </div>
      </header>

      {/* ===== メインコンテンツ ===== */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ===== テーマ入力 ===== */}
        <section style={{ marginBottom: 28 }}>
          <label style={{
            display: "block",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            ディベートテーマ
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={debateStarted}
            className="topic-input"
            placeholder="例）SNSは人間関係を豊かにするか？"
          />

          {/* トレンド生成 */}
          {!debateStarted && (
            <div style={{ marginTop: 14 }}>
              <p style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginBottom: 8,
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}>
                ニュースから自動生成
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="genre-pills">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      disabled={isFetchingTrend}
                      className={`genre-pill${selectedGenre === g ? " active" : ""}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleFetchTrend}
                  disabled={isFetchingTrend}
                  className="btn btn-ghost"
                  style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8rem", padding: "7px 16px" }}
                >
                  {isFetchingTrend ? <><span className="spinner" />生成中</> : "テーマを生成"}
                </button>
              </div>
            </div>
          )}
        </section>

        <hr className="section-divider" style={{ marginBottom: 26 }} />

        {/* ===== 対戦カード ===== */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "var(--accent-surface)",
              padding: "3px 10px",
              borderRadius: 100,
            }}>
              MATCH
            </span>
            <span style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}>
              対戦カード
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 16,
          }}>
            {/* プレイヤー A */}
            <div style={{
              background: bgColorA,
              border: `1.5px solid ${colorA}`,
              borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: colorA,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}>
                SIDE A
              </div>
              <div className="char-select-wrapper">
                <select
                  value={speakerAId}
                  onChange={(e) => setSpeakerAId(Number(e.target.value))}
                  disabled={debateStarted}
                  className="char-select"
                  style={{ borderColor: colorA, background: bgColorA }}
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* vs */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                color: "var(--text-secondary)",
                letterSpacing: "0.02em",
              }}>vs</div>
            </div>

            {/* プレイヤー B */}
            <div style={{
              background: bgColorB,
              border: `1.5px solid ${colorB}`,
              borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: colorB,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}>
                SIDE B
              </div>
              <div className="char-select-wrapper">
                <select
                  value={speakerBId}
                  onChange={(e) => setSpeakerBId(Number(e.target.value))}
                  disabled={debateStarted}
                  className="char-select"
                  style={{ borderColor: colorB, background: bgColorB }}
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" style={{ marginBottom: 26 }} />

        {/* ===== コントロールボタン ===== */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 36 }}>
          <button
            onClick={handleNextTurn}
            disabled={isLoading || !canStart}
            className="btn btn-primary"
            style={{ minWidth: 168, fontSize: "0.9375rem", padding: "12px 32px" }}
          >
            {isLoading
              ? "思考中..."
              : !canStart
                ? "テーマを入力"
                : debateStarted
                  ? "次のターンへ"
                  : "ディベート開始"}
          </button>
        </div>

        {/* ===== ローディングアニメーション ===== */}
        {isLoading && (
          <div style={{ paddingBottom: 24 }}>
            <TypingDots label={`${nextSpeaker === "A" ? speakerAName : speakerBName} が思考中`} />
          </div>
        )}

        {/* ===== モデレーターコメント ===== */}
        {judgeComment && (
          <div style={{
            background: "var(--moderator-bg)",
            borderLeft: "3px solid var(--moderator-border)",
            padding: "12px 16px",
            marginBottom: 28,
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#92610a",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 5px",
            }}>
              Moderator
            </p>
            <p style={{ fontSize: "0.875rem", color: "#5a3e08", margin: 0, lineHeight: 1.7 }}>
              {judgeComment}
            </p>
          </div>
        )}

        {/* ===== 会話ログ ===== */}
        <section style={{ display: "flex", flexDirection: "column" }}>
          {history.map((msg, i) => {
            const isA = msg.role === "A";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: isA ? "row" : "row-reverse",
                  paddingBottom: 24,
                }}
              >
                <div style={{
                  maxWidth: "76%",
                  borderLeft: isA ? `3px solid var(--speaker-a-border)` : undefined,
                  borderRight: !isA ? `3px solid var(--speaker-b-border)` : undefined,
                  paddingLeft:  isA  ? 16 : 0,
                  paddingRight: !isA ? 16 : 0,
                }}>
                  <div style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: isA ? "var(--speaker-a)" : "var(--speaker-b)",
                    marginBottom: 6,
                  }}>
                    {msg.speakerName ?? (isA ? "SIDE A" : "SIDE B")}
                  </div>
                  <div style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--text-primary)" }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* 開始前ガイド */}
        {!debateStarted && !isLoading && (
          <div style={{
            textAlign: "center",
            padding: "56px 0",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
          }}>
            テーマを入力して「ディベート開始」を押すと、議論が始まります。
          </div>
        )}

        {/* ===== マッチアップ表示（ディベート中） ===== */}
        {debateStarted && (
          <div style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 100,
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            zIndex: 100,
          }}>
            <span style={{ color: "var(--speaker-a)" }}>{speakerAName}</span>
            <span style={{ opacity: 0.5, fontSize: "0.7rem" }}>vs</span>
            <span style={{ color: "var(--speaker-b)" }}>{speakerBName}</span>
          </div>
        )}
      </main>
    </div>
  );
}