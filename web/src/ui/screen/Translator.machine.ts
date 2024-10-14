import { setup } from "xstate";

type SignPhraseType = "평서문" | "의문문" | "감탄문" | null;

const SIGN_DETECTOR_CLOSE_ANIMATION_DELAY = 200;

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType;
    },
    events: {} as
      | {
          type: "DONE" | "DONE_AFTER_ANIMATION";
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
      },
    },
    idleAfterAnimation: {
      after: {
        [SIGN_DETECTOR_CLOSE_ANIMATION_DELAY]: { target: "#idle" },
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
                DONE_AFTER_ANIMATION: { target: "#idle.idleAfterAnimation" },
              },
            },
          },
        },
      },
    },
  },
});
