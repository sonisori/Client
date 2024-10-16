import { assign, setup } from "xstate";

import { SignPhraseType } from "../../service/type/phrase";

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType | null;
      initialIdle: boolean;
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
  actions: {
    flagInitialIdle: assign({ initialIdle: false }),
  },
}).createMachine({
  context: {
    signPhraseType: null,
    initialIdle: true,
  },
  id: "root",
  initial: "idle",
  states: {
    idle: {
      on: {
        INPUT_SIGN_LEFT: {
          target: "inputting left sign",
          actions: [
            "flagInitialIdle",
            assign({
              signPhraseType: ({ event }) => event.signPhraseType,
            }),
          ],
        },
      },
    },
    "inputting left sign": {
      on: {
        DONE: { target: "idle" },
      },
    },
  },
});
