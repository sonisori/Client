import { onMount, For, createSignal, onCleanup } from "solid-js";

import { cn } from "../../service/util/cn";
import { Badge } from "../component/base/Badge";
import { Button } from "../component/base/Button";
import { ScrollArea } from "../component/base/ScrollArea";
import { Dropdown } from "../component/Dropdown";
import { MenuLayout } from "../layout/MenuLayout";

export const Translator = () => {
  let videoRef!: HTMLVideoElement;

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.srcObject = stream;
    });
  });

  const [words, setWords] = createSignal(["나는", "오늘", "밥을", "먹었다"]);

  const [messages, setMessages] = createSignal([
    {
      text: "안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요",
      type: "sign",
      author: "left",
    },
    { text: "안녕하세요", type: "sign", author: "right" },
    { text: "안녕하세요", type: "sign", author: "left" },
    { text: "안녕하세요", type: "sign", author: "right" },
    { text: "안녕하세요", type: "sign", author: "left" },
    { text: "안녕하세요", type: "sign", author: "right" },
    { text: "안녕하세요", type: "sign", author: "left" },
    { text: "안녕하세요", type: "sign", author: "right" },
    { text: "안녕하세요", type: "sign", author: "left" },
    { text: "안녕하세요", type: "sign", author: "right" },
  ]);

  const addWord = () => setWords((p) => [...p, "새로운단어"]);
  window.addEventListener("keydown", addWord);
  onCleanup(() => {
    window.removeEventListener("keydown", addWord);
  });

  return (
    <MenuLayout>
      <div class="inset-top-0 fixed left-72 right-0">
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
              class="flex gap-4 p-5"
              style={{ "padding-right": "calc( 50vw - 144px - 80px )" }}
            >
              <For each={words()}>
                {(word) => (
                  <Dropdown
                    menu={[
                      {
                        items: [
                          {
                            title: "여기부터 다시 입력",
                            onClick: () => console.log(word),
                          },
                          { title: "삭제", onClick: () => console.log(word) },
                        ],
                      },
                    ]}
                  >
                    <Badge size="md" class="whitespace-pre" variant="secondary">
                      {word}
                    </Badge>
                  </Dropdown>
                )}
              </For>
            </div>
          </ScrollArea>
        </div>
        <div class="h-[calc(50vh-70px-77px)] w-full overflow-y-scroll p-5">
          <div class="space-y-1">
            <For each={messages()}>
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
            <Button>수어 인식</Button>
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
