import { useMachine } from "@xstate/solid";
import { For, createSignal, Show } from "solid-js";

import { Phrase } from "../../service/type/phrase";
import { cn } from "../../service/util/cn";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollArea";
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
          direction="y"
          class="h-12"
          defaultOffset={phrases().length * 500}
        >
          <div class="flex h-[calc(100%-77px)] w-full flex-col justify-end p-5">
            <div class="space-y-1">
              <For each={phrases()}>
                {(message) => (
                  <div
                    class={cn("flex", {
                      "justify-start": message.author === "left",
                      "justify-end": message.author === "right",
                    })}
                  >
                    <p
                      class={cn("max-w-[512px] rounded-2xl px-2 py-1.5", {
                        "rounded-bl-none bg-accent-foreground/80 pr-3 text-accent":
                          message.author === "left",
                        "rounded-br-none bg-accent pl-3 text-accent-foreground":
                          message.author === "right",
                      })}
                    >
                      {message.text}
                    </p>
                  </div>
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
