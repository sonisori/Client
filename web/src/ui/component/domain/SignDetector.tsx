import {
  Show,
  For,
  onMount,
  createSignal,
  createReaction,
  onCleanup,
} from "solid-js";

import { Word } from "../../../service/type/word";
import { cn } from "../../../service/util/cn";
import { Badge } from "../base/Badge";
import { Button } from "../base/Button";
import { ScrollArea } from "../base/ScrollArea";
import { Dropdown } from "../Dropdown";

export const SignDetector = (props: { onDone: () => void }) => {
  const [words, setWords] = createSignal<Word[]>([]);
  const [streamStarted, setStreamStarted] = createSignal(false);
  const [closed, setClosed] = createSignal(false);

  let videoRef!: HTMLVideoElement;
  let stream: MediaStream;

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((_stream) => {
      videoRef.srcObject = _stream;
      stream = _stream;
      setStreamStarted(true);
    });
  });

  const trackClose = createReaction(() =>
    setTimeout(() => props.onDone(), 200),
  );
  trackClose(closed);

  onCleanup(() => {
    stream?.getTracks().forEach((track) => track.stop());
  });

  return (
    <div
      class={cn("absolute inset-x-0 top-0 z-10 bg-white duration-200", {
        "animate-out fade-out slide-out-to-top-10 fill-mode-forwards": closed(),
        "animate-in fade-in slide-in-from-top-10": !closed(),
      })}
    >
      <div class="flex h-[50vh] -scale-x-100 justify-center bg-gray-50">
        <video
          ref={videoRef}
          class={cn("h-full duration-200", { "opacity-0": !streamStarted() })}
          autoplay
          playsinline
        />
      </div>
      <div class="border-b">
        <div class="relative">
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
          <Button
            size="sm"
            class="absolute right-5 top-5"
            onClick={() => setClosed(true)}
          >
            마침
          </Button>
        </div>
      </div>
    </div>
  );
};
