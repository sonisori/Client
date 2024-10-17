export type Phrase = {
  text: string;
  type: "sign" | "text";
  author: "left" | "right";
};

export type SignPhraseType = "평서문" | "의문문" | "감탄문";
