import { setup } from "xstate";

type SignPhraseType = "평서문" | "의문문" | "감탄문" | null;

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType;
    },
    events: {} as
      | {
          type: "DONE";
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
  id: "root",
  initial: "idle",
  states: {
    idle: {
      on: {
        INPUT_SIGN_LEFT: { target: "#root.inputting.left.sign" },
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
                DONE: { target: "#root.idle" },
              },
            },
          },
        },
      },
    },
  },
});
