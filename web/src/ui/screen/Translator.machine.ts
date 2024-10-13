import { setup } from "xstate";

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: "평서문" | "의문문" | "감탄문" | null;
    },
    events: {} as {
      type: "INPUT_SIGN_LEFT" | "INPUT_TEXT_LEFT" | "INPUT_TEXT_RIGHT" | "DONE";
    },
  },
}).createMachine({
  context: {
    signPhraseType: null,
  },
  states: {
    idle: {
      on: {
        INPUT_SIGN_LEFT: { target: "inputting.left.sign" },
        INPUT_TEXT_LEFT: { target: "inputting.left.text" },
        INPUT_TEXT_RIGHT: { target: "inputting.right.text" },
      },
    },
    inputting: {
      states: {
        left: {
          states: {
            sign: {
              meta: () => ({ signPhraseType: "평서문" }),
              on: {
                DONE: { target: "idle" },
              },
            },
            text: {
              on: {
                DONE: { target: "idle" },
              },
            },
          },
        },
        right: {
          states: {
            text: {
              on: {
                DONE: { target: "idle" },
              },
            },
          },
        },
      },
    },
  },
});
