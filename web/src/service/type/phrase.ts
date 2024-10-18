export type Phrase = {
  author: "left" | "right";
  text: string;
  type: "sign" | "text";
};

export type SignPhraseType = "감탄문" | "의문문" | "평서문";
