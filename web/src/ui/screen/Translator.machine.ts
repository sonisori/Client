import { assign, setup } from "xstate";

import { SignPhraseType } from "../../service/type/phrase";

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType | null;
    },
    events: {} as
      | {
          type: "DONE";
        }
      | {
          type: "INPUT_SIGN_LEFT";
          signPhraseType: SignPhraseType;
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
        INPUT_SIGN_LEFT: {
          target: "#root.inputting.left.sign",
          actions: assign({
            signPhraseType: ({ event }) => event.signPhraseType,
          }),
        },
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
