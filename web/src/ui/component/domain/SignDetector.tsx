import { createPresence } from "@solid-primitives/presence";
import {
  Show,
  For,
  onMount,
  createSignal,
  onCleanup,
  JSXElement,
} from "solid-js";

import { SignPhraseType } from "../../../service/type/phrase";
import { Word } from "../../../service/type/word";
import { cn } from "../../../service/util/cn";
import { PropsOf } from "../../../service/util/type";
import { Badge } from "../base/Badge";
import { Button } from "../base/Button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "../base/Popover";
import { ScrollArea } from "../base/ScrollArea";
import { Dropdown } from "../Dropdown";

const TRANSITION_DURATION = 200;

const SignDetectorRoot = (props: { children: JSXElement; open: boolean }) => {
  const { isMounted, isVisible } = createPresence(() => props.open, {
    transitionDuration: TRANSITION_DURATION,
  });
  return (
    <Show when={isMounted()}>
      <div
        class={cn("absolute inset-x-0 top-0 z-10 bg-white duration-200", {
          "animate-out fade-out slide-out-to-top-10 fill-mode-forwards":
            !isVisible(),
          "animate-in fade-in slide-in-from-top-10": isVisible(),
        })}
      >
        {props.children}
      </div>
    </Show>
  );
};

const SignDetectorBody = (props: {
  onDone: () => void;
  onCancel: () => void;
  signPhraseType: SignPhraseType;
}) => {
  const [words, setWords] = createSignal<Word[]>([]);
  const [streamStarted, setStreamStarted] = createSignal(false);

  let videoRef!: HTMLVideoElement;
  let stream: MediaStream;

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((_stream) => {
      videoRef.srcObject = _stream;
      stream = _stream;
      setStreamStarted(true);
    });
  });
  onCleanup(() => {
    stream?.getTracks().forEach((track) => track.stop());
  });

  return (
    <>
      <div class="relative flex h-[50vh] justify-center bg-gray-50">
        <video
          ref={videoRef}
          class={cn("h-full -scale-x-100 duration-200", {
            "opacity-0": !streamStarted(),
          })}
          autoplay
          playsinline
          onClick={() => setWords((words) => [...words, { text: "테스트" }])}
        />
        <Badge variant="outline" class="absolute bottom-5 right-5">
          {props.signPhraseType}
        </Badge>
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
                              setWords((words) => words.slice(0, index() + 1));
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
          <div class="absolute right-5 top-5 flex gap-3">
            <Button
              size="sm"
              onClick={() => {
                props.onDone();
              }}
            >
              완료
            </Button>
            <Show
              when={words().length > 0}
              fallback={
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={props.onCancel}
                >
                  취소
                </Button>
              }
            >
              <Popover>
                <PopoverTrigger>
                  <Button size="sm" variant="destructive">
                    취소
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverTitle class="space-y-2">
                    <h4 class="font-medium leading-none">입력 취소</h4>
                    <p class="text-sm text-muted-foreground">
                      입력한 단어가 모두 지워집니다
                    </p>
                  </PopoverTitle>
                  <PopoverDescription class="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={props.onCancel}
                    >
                      취소
                    </Button>
                  </PopoverDescription>
                </PopoverContent>
              </Popover>
            </Show>
          </div>
        </div>
      </div>
    </>
  );
};

export const SignDetector = (
  props: Omit<PropsOf<typeof SignDetectorRoot>, "children"> &
    PropsOf<typeof SignDetectorBody>,
) => {
  return (
    <SignDetectorRoot open={props.open}>
      <SignDetectorBody
        onDone={props.onDone}
        signPhraseType={props.signPhraseType}
        onCancel={props.onCancel}
      />
    </SignDetectorRoot>
  );
};
