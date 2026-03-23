export type VoicevoxCharacter = {
  id: number;
  name: string;
  character: string;
  style: string;
  color: string;
  bgColor: string;
};

export const CHARACTERS: VoicevoxCharacter[] = [
  { id: 3,  name: "ずんだもん",           character: "ずんだもん",           style: "ノーマル", color: "#428b22", bgColor: "#e8f5e0" },
  { id: 2,  name: "四国めたん",           character: "四国めたん",           style: "ノーマル", color: "#d13b76", bgColor: "#fbeaf1" },
  { id: 8,  name: "春日部つむぎ",         character: "春日部つむぎ",         style: "ノーマル", color: "#f39800", bgColor: "#fef4e5" },
  { id: 10, name: "雨晴はう",             character: "雨晴はう",             style: "ノーマル", color: "#00a0e9", bgColor: "#e5f5fd" },
  { id: 9,  name: "波音リツ",             character: "波音リツ",             style: "ノーマル", color: "#c7000b", bgColor: "#fae5e6" },
  { id: 11, name: "玄野武宏",             character: "玄野武宏",             style: "ノーマル", color: "#0f4c81", bgColor: "#e6edf2" },
  { id: 12, name: "白上虎太郎",           character: "白上虎太郎",           style: "ふつう",   color: "#dca800", bgColor: "#fbf6e5" },
  { id: 13, name: "青山龍星",             character: "青山龍星",             style: "ノーマル", color: "#2c3e50", bgColor: "#e9ebed" },
  { id: 14, name: "冥鳴ひまり",           character: "冥鳴ひまり",           style: "ノーマル", color: "#6b3fa0", bgColor: "#f0eaf5" },
  { id: 16, name: "九州そら",             character: "九州そら",             style: "ノーマル", color: "#00896c", bgColor: "#e5f3f0" },
  { id: 20, name: "もち子さん",           character: "もち子さん",           style: "ノーマル", color: "#e87a90", bgColor: "#fcecee" },
  { id: 52, name: "雀松朱司",             character: "雀松朱司",             style: "ノーマル", color: "#8a3b2b", bgColor: "#f3eaea" },
  { id: 47, name: "ナースロボ＿タイプＴ", character: "ナースロボ＿タイプＴ", style: "ノーマル", color: "#4682b4", bgColor: "#ecf2f7" },
];