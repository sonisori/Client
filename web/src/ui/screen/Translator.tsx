import { onMount, For, createSignal } from "solid-js";

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
                    <Badge size="md" class="whitespace-pre">
                      {word}
                    </Badge>
                  </Dropdown>
                )}
              </For>
            </div>
          </ScrollArea>
        </div>
        <div class="bg-gray-50 p-5">
          <Button
            onClick={() => {
              setWords((p) => [...p, "새로운단어"]);
            }}
          >
            단어 인식 예시
          </Button>
        </div>
      </div>
    </MenuLayout>
  );
};
