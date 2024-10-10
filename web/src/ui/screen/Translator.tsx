import { onMount, For } from "solid-js";

import { Badge } from "../component/base/Badge";
import { Dropdown } from "../component/Dropdown";
import { MenuLayout } from "../layout/MenuLayout";

export const Translator = () => {
  let videoRef!: HTMLVideoElement;

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.srcObject = stream;
    });
  });

  const words = [
    "나는",
    "오늘",
    "밥을",
    "먹었다",
    "나는",
    "오늘",
    "밥을",
    "먹었다",
    "나는",
    "오늘",
    "밥을",
    "먹었다",
    "나는",
    "오늘",
    "밥을",
    "먹었다",
  ];

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
        <div class="flex gap-4 overflow-x-scroll border-b p-5">
          <For each={words}>
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
      </div>
    </MenuLayout>
  );
};
