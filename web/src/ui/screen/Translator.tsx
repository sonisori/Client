import { useMachine } from "@xstate/solid";
import { For, createSignal, createEffect, Show } from "solid-js";

import { Phrase } from "../../service/type/phrase";
import { cn } from "../../service/util/cn";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollAreaV2";
import { PhraseBubble } from "../component/domain/PhraseBubble";
import { SignDetector } from "../component/domain/SignDetector";
import { Dropdown } from "../component/Dropdown";
import { MenuLayout } from "../layout/MenuLayout";
import { translatorScreenMachine } from "./Translator.machine";

const STATE_HELP_LABEL_MAP = {
  idle: "대기",
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

  createEffect<typeof snapshot.value>((prevState) => {
    if (!snapshot.matches(prevState)) {
      viewport()?.scrollTo({ top: Number.MAX_SAFE_INTEGER });
    }
    return snapshot.value;
  }, snapshot.value);

  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <SignDetector
          signPhraseType={snapshot.context.signPhraseType!}
          open={snapshot.matches("inputting left sign")}
          onDone={() => {
            setPhrases((phrases) => [
              ...phrases,
              {
                author: "left",
                text: `수어로 인식한 문장이 표시됩니다. ${phrases.length + 1}`,
                type: "sign",
              },
            ]);
            send({ type: "DONE_SIGN" });
          }}
          onCancel={() => {
            send({ type: "DONE_SIGN" });
          }}
        />
        <ScrollArea
          viewportRef={setViewport}
          direction="vertical"
          class="absolute inset-x-0"
          style={{
            // sign-detector의 바닥에 붙도록
            top: snapshot.matches("inputting left sign")
              ? "calc(50vh + 70px)"
              : "0",
            bottom: BOTTOM_BAR_HEIGHT_PX,
          }}
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
                    phrase={phrase}
                    autoFocus={phrase.type === "text"}
                  />
                )}
              </For>
            </div>
          </div>
        </ScrollArea>
        <div
          class="fixed bottom-0 left-72 right-0 z-10 flex items-center border-t bg-white px-5"
          style={{ height: BOTTOM_BAR_HEIGHT_PX }}
        >
          <Show
            when={snapshot.matches("idle")}
            fallback={
              <p
                class="text-sm text-primary/80 duration-200 animate-in fade-in slide-in-from-top-5"
                onClick={() =>
                  snapshot.can({ type: "DONE_TEXT" }) &&
                  send({ type: "DONE_TEXT" })
                }
              >
                {STATE_HELP_LABEL_MAP[snapshot.value]}
              </p>
            }
          >
            <div
              class={cn("flex flex-1 justify-between", {
                "duration-200 animate-in fade-in slide-in-from-bottom-5":
                  !snapshot.context.initialIdle,
              })}
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
                  variant="secondary"
                  onClick={() => {
                    send({ type: "INPUT_TEXT_RIGHT" });
                    setPhrases((phrases) => [
                      ...phrases,
                      { author: "right", text: "", type: "text" },
                    ]);
                  }}
                >
                  텍스트 입력
                </Button>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </MenuLayout>
  );
};
