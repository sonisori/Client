import { onMount, For, createSignal, Show } from "solid-js";

import { Phrase } from "../../service/type/phrase";
import { Word } from "../../service/type/word";
import { cn } from "../../service/util/cn";
import { Badge } from "../component/base/Badge";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollArea";
import { Dropdown } from "../component/Dropdown";
import { MenuLayout } from "../layout/MenuLayout";

export const Translator = () => {
  const [words, setWords] = createSignal<Word[]>([]);
  const [phrases] = createSignal<Phrase[]>([]);

  let videoRef!: HTMLVideoElement;
  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.srcObject = stream;
    });
  });

  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <div class="flex h-[50vh] justify-center bg-gray-50">
          <video
            ref={videoRef}
            class="size-16 h-full w-full -scale-x-100"
            autoplay
            playsinline
          />
        </div>
        <div class="border-b">
          <ScrollArea direction="x" defaultOffset={words().length * 500}>
            <div
              class="flex h-[70px] items-center gap-4 px-5"
              style={{ "padding-right": "calc( 50vw - 144px - 80px )" }}
            >
              <Show when={words().length === 0}>
                <p class="animate-pulse text-sm text-secondary-foreground">
                  수어 인식중...
                </p>
              </Show>
              <For each={words()}>
                {(word, index) => (
                  <Dropdown
                    menu={[
                      {
                        items: [
                          {
                            title: "여기부터 다시 입력",
                            onClick: () => {
                              setWords((words) => words.slice(0, index()));
                            },
                          },
                          {
                            title: "삭제",
                            onClick: () => {
                              setWords((words) =>
                                words.filter((_, i) => i != index()),
                              );
                            },
                          },
                        ],
                      },
                    ]}
                  >
                    <Badge
                      size="md"
                      class="whitespace-pre animate-in fade-in"
                      variant="secondary"
                      tabIndex={-1}
                    >
                      {word.text}
                    </Badge>
                  </Dropdown>
                )}
              </For>
            </div>
          </ScrollArea>
        </div>
        <div class="h-[calc(50vh-70px-77px)] w-full overflow-y-scroll p-5">
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
        <div class="flex justify-between border-t p-5">
          <div class="flex gap-5">
            <Dropdown
              menu={[
                {
                  items: [
                    {
                      title: "평서문",
                      onClick: () => {
                        setWords((words) => [
                          ...words,
                          { text: "수어로 인식한 단어" },
                        ]);
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
