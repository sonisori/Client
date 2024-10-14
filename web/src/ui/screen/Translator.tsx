import { useMachine } from "@xstate/solid";
import { For, createSignal, Show } from "solid-js";

import { Phrase } from "../../service/type/phrase";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollArea";
import { PhraseBubble } from "../component/domain/PhraseBubble";
import { SignDetector } from "../component/domain/SignDetector";
import { Dropdown } from "../component/Dropdown";
import { MenuLayout } from "../layout/MenuLayout";
import { translatorScreenMachine } from "./Translator.machine";

export const Translator = () => {
  const [snapshot, send] = useMachine(translatorScreenMachine);
  const [phrases, setPhrases] = createSignal<Phrase[]>([]);

  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <Show when={snapshot.matches({ inputting: { left: "sign" } })}>
          <SignDetector
            onDone={() => {
              setPhrases((phrases) => [
                ...phrases,
                {
                  author: "left",
                  text: `수어로 인식한 문장이 표시됩니다. ${phrases.length + 1}`,
                  type: "sign",
                },
              ]);
              send({ type: "DONE" });
            }}
          />
        </Show>
        <ScrollArea
          disableAnimation
          direction="y"
          class="absolute inset-x-0 bottom-[77px]"
          style={{
            top: snapshot.matches({ inputting: { left: "sign" } })
              ? "calc(50vh + 70px)"
              : "0",
          }}
          defaultOffset={phrases().length * 500}
        >
          <div class="flex w-full flex-col justify-end p-5">
            <div class="space-y-1">
              <For each={phrases()}>
                {(phrase, index) => (
                  <PhraseBubble
                    phrase={phrase}
                    onEdit={(phrase) =>
                      setPhrases((phrases) => [
                        ...phrases.slice(0, index()),
                        phrase,
                        ...phrases.slice(index() + 1),
                      ])
                    }
                  />
                )}
              </For>
            </div>
          </div>
        </ScrollArea>
        <div class="fixed bottom-0 left-72 right-0 z-10 flex justify-between border-t bg-white p-5">
          <div class="flex gap-5">
            <Dropdown
              menu={[
                {
                  items: [
                    {
                      title: "평서문",
                      disabled: snapshot.matches({
                        inputting: { left: "sign" },
                      }),
                      onClick: () => {
                        send({ type: "INPUT_SIGN_LEFT", phraseType: "평서문" });
                      },
                    },
                    {
                      title: "의문문",
                      disabled: snapshot.matches({
                        inputting: { left: "sign" },
                      }),
                      onClick: () => {
                        send({ type: "INPUT_SIGN_LEFT", phraseType: "의문문" });
                      },
                    },
                    {
                      title: "감탄문",
                      disabled: snapshot.matches({
                        inputting: { left: "sign" },
                      }),
                      onClick: () => {
                        send({ type: "INPUT_SIGN_LEFT", phraseType: "감탄문" });
                      },
                    },
                  ],
                },
              ]}
            >
              <Button>수어 인식</Button>
            </Dropdown>
            <Button>텍스트 입력</Button>
          </div>
          <div class="flex gap-5">
            <Button variant="secondary">텍스트 입력</Button>
          </div>
        </div>
      </div>
    </MenuLayout>
  );
};
