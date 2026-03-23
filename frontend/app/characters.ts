/**
 * VOICEVOXキャラクターデータ（フロントエンド用）
 * バックエンドが起動していない場合もこのデータを使用する。
 * personality はバックエンドの voicevox_characters.json で管理。
 */
export type VoicevoxCharacter = {
  id: number;
  name: string;
  character: string;
  style: string;
  color: string;
  bgColor: string;
};

export const CHARACTERS: VoicevoxCharacter[] = [
  { id: 3,  name: "ずんだもん（ノーマル）",         character: "ずんだもん",         style: "ノーマル",   color: "#1d7a48", bgColor: "#dff4ea" },
  { id: 1,  name: "ずんだもん（あまあま）",         character: "ずんだもん",         style: "あまあま",   color: "#2a9458", bgColor: "#e5f8ed" },
  { id: 7,  name: "ずんだもん（ツンツン）",         character: "ずんだもん",         style: "ツンツン",   color: "#1d7a48", bgColor: "#dff4ea" },
  { id: 2,  name: "四国めたん（ノーマル）",         character: "四国めたん",         style: "ノーマル",   color: "#7340b8", bgColor: "#ede0ff" },
  { id: 0,  name: "四国めたん（あまあま）",         character: "四国めたん",         style: "あまあま",   color: "#9455d4", bgColor: "#f2e8ff" },
  { id: 6,  name: "四国めたん（ツンツン）",         character: "四国めたん",         style: "ツンツン",   color: "#6030a0", bgColor: "#e8d8f8" },
  { id: 8,  name: "春日部つむぎ（ノーマル）",       character: "春日部つむぎ",       style: "ノーマル",   color: "#c25318", bgColor: "#feeadb" },
  { id: 10, name: "雨晴はう（ノーマル）",           character: "雨晴はう",           style: "ノーマル",   color: "#1e7ab8", bgColor: "#dceffe" },
  { id: 9,  name: "波音リツ（ノーマル）",           character: "波音リツ",           style: "ノーマル",   color: "#b83030", bgColor: "#fce4e4" },
  { id: 11, name: "玄野武宏（ノーマル）",           character: "玄野武宏",           style: "ノーマル",   color: "#2454a0", bgColor: "#dde8fa" },
  { id: 12, name: "白上虎太郎（ふつう）",           character: "白上虎太郎",         style: "ふつう",     color: "#9e6a00", bgColor: "#fef3d0" },
  { id: 13, name: "青山龍星（ノーマル）",           character: "青山龍星",           style: "ノーマル",   color: "#1a3870", bgColor: "#dce4f6" },
  { id: 14, name: "冥鳴ひまり（ノーマル）",         character: "冥鳴ひまり",         style: "ノーマル",   color: "#622888", bgColor: "#eddcf8" },
  { id: 16, name: "九州そら（ノーマル）",           character: "九州そら",           style: "ノーマル",   color: "#187878", bgColor: "#d8f4f4" },
  { id: 20, name: "もち子さん（ノーマル）",         character: "もち子さん",         style: "ノーマル",   color: "#a82858", bgColor: "#fce2ee" },
  { id: 52, name: "雀松朱司（ノーマル）",           character: "雀松朱司",           style: "ノーマル",   color: "#8c5010", bgColor: "#fdefd8" },
  { id: 47, name: "ナースロボ＿タイプＴ（ノーマル）", character: "ナースロボ＿タイプＴ", style: "ノーマル", color: "#2e5c80", bgColor: "#dceaf4" },
];
