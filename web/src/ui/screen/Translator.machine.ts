import { assign, setup } from "xstate";

import { SignPhraseType } from "../../service/type/phrase";

export const translatorScreenMachine = setup({
  types: {
    context: {} as {
      signPhraseType: SignPhraseType | null;
      initialIdle: boolean;
    },
    events: {} as
      | { type: "DONE_SIGN" }
      | { type: "DONE_TEXT" }
      | { type: "INPUT_TEXT_LEFT" }
      | { type: "INPUT_TEXT_RIGHT" }
      | { type: "INPUT_SIGN_LEFT"; signPhraseType: SignPhraseType },
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
        INPUT_TEXT_LEFT: {
          target: "inputting left text",
          actions: ["flagInitialIdle"],
        },
        INPUT_TEXT_RIGHT: {
          target: "inputting right text",
          actions: ["flagInitialIdle"],
        },
      },
    },
    "inputting left sign": {
      on: {
        DONE_SIGN: { target: "idle" },
      },
    },
    "inputting left text": {
      after: {
        3000: "idle",
      },
      on: {
        DONE_TEXT: { target: "idle" },
      },
    },
    "inputting right text": {
      after: {
        3000: "idle",
      },
      on: {
        DONE_TEXT: { target: "idle" },
      },
    },
  },
});
