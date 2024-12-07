import { createPresence } from "@solid-primitives/presence";
import { useMachine } from "@xstate/solid";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";

import { Phrase } from "../../service/type/phrase";
import { cn } from "../../service/util/cn";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollAreaV2";
import { PhraseBubble } from "../component/domain/PhraseBubble";
import { createSentence, SignDetector } from "../component/domain/SignDetector";
import { Dropdown } from "../component/Dropdown";
import { translatorScreenMachine } from "./Translator.machine";

const STATE_HELP_LABEL_MAP = {
  idle: null,
  "inputting left sign": "수어를 인식하면 SoniSori AI가 한국어로 번역합니다.",
  "inputting left text": "키보드를 사용해 텍스트를 입력할 수 있습니다.",
  "inputting right text": "키보드를 사용해 텍스트를 입력할 수 있습니다.",
} as const;

const BOTTOM_BAR_HEIGHT_PX = "77px";

const DEFAULT_PHRASES: Phrase[] = [
  { author: "left", text: "안녕하세요! SoniSori입니다.", type: "sign" },
  {
    author: "right",
    text: "아래 버튼을 눌러 대화를 시작하세요.",
    type: "sign",
  },
];

export const Translator = () => {
  const [snapshot, send] = useMachine(translatorScreenMachine);

  const [phrases, setPhrases] = createSignal<Phrase[]>([]);
  const [viewport, setViewport] = createSignal<HTMLElement>();
  const [loading, setLoading] = createSignal(false);

  createEffect<typeof snapshot.value>((prevState) => {
    if (!snapshot.matches(prevState)) {
      viewport()?.scrollTo({ top: Number.MAX_SAFE_INTEGER });
    }
    return snapshot.value;
  }, snapshot.value);

  const idlePresence = createPresence(() => snapshot.hasTag("idle"), {
    transitionDuration: 200,
  });
  const inputtingPresence = createPresence(() => snapshot.hasTag("inputting"), {
    transitionDuration: 200,
  });
  const inputtingHelpMemo = createMemo<
    (typeof STATE_HELP_LABEL_MAP)[typeof snapshot.value]
  >(
    (prev) => STATE_HELP_LABEL_MAP[snapshot.value] ?? prev,
    STATE_HELP_LABEL_MAP[snapshot.value],
  );

  return (
    <div class="fixed inset-y-0 left-72 right-0">
      <SignDetector
        disabled={loading()}
        onCancel={() => {
          send({ type: "DONE_SIGN" });
        }}
        onDone={(words) => {
          setLoading(true);
          createSentence({
            signPhraseType: snapshot.context.signPhraseType!,
            words,
          })
            .then((phrase) => {
              setPhrases((phrases) => [
                ...phrases,
                {
                  author: "left",
                  text: phrase,
                  type: "sign",
                },
              ]);
              send({ type: "DONE_SIGN" });
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        open={snapshot.matches("inputting left sign")}
        signPhraseType={snapshot.context.signPhraseType!}
      />
      <ScrollArea
        class="absolute inset-x-0"
        direction="vertical"
        style={{
          // sign-detector의 바닥에 붙도록
          top: snapshot.matches("inputting left sign")
            ? "calc(50vh + 70px)"
            : "0",
          bottom: BOTTOM_BAR_HEIGHT_PX,
        }}
        viewportRef={setViewport}
      >
        <div
          class="flex w-full flex-col justify-end p-5"
          style={{
            // 말풍선이 scroll-area의 바닥에 위치하도록
            "min-height": snapshot.matches("inputting left sign")
              ? `calc(50vh - 70px - ${BOTTOM_BAR_HEIGHT_PX})`
              : `calc(100vh - ${BOTTOM_BAR_HEIGHT_PX})`,
          }}
        >
          <div class="space-y-1">
            <For
              each={
                snapshot.matches("idle") && phrases().length === 0
                  ? DEFAULT_PHRASES
                  : phrases()
              }
            >
              {(phrase) => (
                <PhraseBubble
                  autoFocus={phrase.type === "text"}
                  phrase={phrase}
                />
              )}
            </For>
          </div>
        </div>
      </ScrollArea>
      <div
        class="fixed bottom-0 left-72 right-0 z-10 overflow-hidden border-t bg-white"
        style={{ height: BOTTOM_BAR_HEIGHT_PX }}
      >
        <Show when={idlePresence.isMounted()}>
          <div
            class={cn(
              "absolute inset-x-5 inset-y-0 flex items-center justify-between duration-200 fill-mode-forwards",
              {
                "animate-in fade-in slide-in-from-bottom-10":
                  !snapshot.context.initialIdle && idlePresence.isVisible(),
                "animate-out fade-out slide-out-to-bottom-10":
                  !idlePresence.isVisible(),
              },
            )}
          >
            <div class="flex gap-5">
              <Dropdown
                menu={[
                  {
                    items: [
                      {
                        title: "평서문",
                        onClick: () => {
                          send({
                            type: "INPUT_SIGN_LEFT",
                            signPhraseType: "평서문",
                          });
                        },
                      },
                      {
                        title: "의문문",
                        onClick: () => {
                          send({
                            type: "INPUT_SIGN_LEFT",
                            signPhraseType: "의문문",
                          });
                        },
                      },
                      {
                        title: "감탄문",
                        onClick: () => {
                          send({
                            type: "INPUT_SIGN_LEFT",
                            signPhraseType: "감탄문",
                          });
                        },
                      },
                    ],
                  },
                ]}
              >
                <Button>수어 인식</Button>
              </Dropdown>
              <Button
                onClick={() => {
                  send({ type: "INPUT_TEXT_LEFT" });
                  setPhrases((phrases) => [
                    ...phrases,
                    { author: "left", text: "", type: "text" },
                  ]);
                }}
              >
                텍스트 입력
              </Button>
            </div>
            <div class="flex gap-5">
              <Button
                onClick={() => {
                  send({ type: "INPUT_TEXT_RIGHT" });
                  setPhrases((phrases) => [
                    ...phrases,
                    { author: "right", text: "", type: "text" },
                  ]);
                }}
                variant="secondary"
              >
                텍스트 입력
              </Button>
            </div>
          </div>
        </Show>
        <Show when={inputtingPresence.isMounted()}>
          <p
            class={cn(
              "absolute inset-x-5 inset-y-0 flex items-center text-sm text-primary/80 duration-200 fill-mode-forwards",
              {
                "animate-in fade-in slide-in-from-top-10":
                  inputtingPresence.isVisible(),
                "animate-out fade-out slide-out-to-top-10":
                  !inputtingPresence.isVisible(),
              },
            )}
            onClick={() =>
              snapshot.can({ type: "DONE_TEXT" }) && send({ type: "DONE_TEXT" })
            }
          >
            {inputtingHelpMemo()}
          </p>
        </Show>
      </div>
    </div>
  );
};
