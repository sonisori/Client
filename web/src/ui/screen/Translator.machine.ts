import { setup } from "xstate";

type SignPhraseType = "평서문" | "의문문" | "감탄문" | null;

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType;
    },
    events: {} as
      | {
          type: "INPUT_TEXT_LEFT" | "INPUT_TEXT_RIGHT" | "DONE";
        }
      | {
          type: "INPUT_SIGN_LEFT";
          phraseType: SignPhraseType;
        },
  },
}).createMachine({
  context: {
    signPhraseType: null,
  },
  id: "idle",
  initial: "idle",
  states: {
    idle: {
      on: {
        INPUT_SIGN_LEFT: { target: "inputting.left.sign" },
        INPUT_TEXT_LEFT: { target: "inputting.left.text" },
        INPUT_TEXT_RIGHT: { target: "inputting.right.text" },
      },
    },
    inputting: {
      initial: "left",
      states: {
        left: {
          initial: "sign",
          states: {
            sign: {
              on: {
                DONE: { target: "#idle" },
              },
            },
            text: {
              on: {
                DONE: { target: "#idle" },
              },
            },
          },
        },
        right: {
          initial: "text",
          states: {
            text: {
              on: {
                DONE: { target: "#idle" },
              },
            },
          },
        },
      },
    },
  },
});
