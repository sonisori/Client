import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";
import { createPresence } from "@solid-primitives/presence";
import {
  createSignal,
  For,
  JSXElement,
  onCleanup,
  onMount,
  Show,
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
  onCancel: () => void;
  onDone: () => void;
  signPhraseType: SignPhraseType;
}) => {
  const [words, setWords] = createSignal<Word[]>([]);
  const [help, setHelp] = createSignal<null | string>(null);

  let canvasRef!: HTMLCanvasElement;
  let videoRef!: HTMLVideoElement;
  let stream: MediaStream | null = null;
  let handLandmarker: HandLandmarker;
  let animationFrame: null | number = null;

  const streamMedia = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error("카메라를 사용할 수 없는 디바이스입니다.");
    }

    const media = await navigator.mediaDevices.getUserMedia({ video: true });
    stream = media;
    videoRef.srcObject = media;
    const { promise, resolve } = Promise.withResolvers<void>();
    videoRef.addEventListener(
      "loadeddata",
      () => {
        resolve();
      },
      { once: true },
    );

    return promise;
  };

  const loadLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/mediapipe/model/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
    await handLandmarker.setOptions({ runningMode: "VIDEO" });
  };

  const predictMedia = () => {
    canvasRef.style.width = videoRef.clientWidth + "px";
    canvasRef.style.height = videoRef.clientHeight + "px";
    canvasRef.width = videoRef.videoWidth;
    canvasRef.height = videoRef.videoHeight;

    const time = performance.now();
    const { landmarks } = handLandmarker.detectForVideo(videoRef!, time);
    const context = canvasRef.getContext("2d")!;
    context.save();
    context.clearRect(0, 0, canvasRef.width, canvasRef.height);
    landmarks.forEach((landmark) => {
      const drawingUtils = new DrawingUtils(context);
      drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {
        lineWidth: 5,
        color: "#0f298f",
      });
      drawingUtils.drawLandmarks(landmark, { color: "#ff7f00", lineWidth: 2 });
    });
    context.restore();
    animationFrame = requestAnimationFrame(predictMedia);
  };

  onMount(async () => {
    try {
      await streamMedia();
      await loadLandmarker();
      predictMedia();
    } catch (error) {
      setHelp((error as Error).message);
    }
  });

  onCleanup(() => {
    stream?.getTracks().forEach((track) => track.stop());
    if (typeof animationFrame === "number") {
      cancelAnimationFrame(animationFrame);
    }
    handLandmarker?.close();
  });

  return (
    <>
      <div class="relative flex justify-center bg-gray-50">
        <div class="relative">
          <video
            autoplay
            class="h-[50vh]"
            onClick={() => setWords((words) => [...words, { text: "테스트" }])}
            playsinline
            ref={videoRef}
            style={{ transform: "rotateY(180deg)" }}
          />
          <canvas
            class="absolute left-0 top-0"
            ref={canvasRef}
            style={{ transform: "rotateY(180deg)" }}
          />
        </div>
        <Badge class="absolute bottom-5 right-5 bg-white" variant="outline">
          {props.signPhraseType}
        </Badge>
      </div>
      <div class="border-b">
        <div class="relative">
          <ScrollArea defaultOffset={words().length * 500} direction="x">
            <div
              class="flex h-[70px] items-center gap-4 px-5"
              style={{ "padding-right": "calc( 50vw - 144px - 80px )" }}
            >
              <Show when={help() || words().length === 0}>
                <p class="animate-pulse text-sm text-secondary-foreground">
                  {help() || "수어 인식중..."}
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
                      class="whitespace-pre animate-in fade-in"
                      size="md"
                      tabIndex={-1}
                      variant="secondary"
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
              onClick={() => {
                props.onDone();
              }}
              size="sm"
            >
              완료
            </Button>
            <Show
              fallback={
                <Button
                  onClick={props.onCancel}
                  size="sm"
                  variant="destructive"
                >
                  취소
                </Button>
              }
              when={words().length > 0}
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
                      onClick={props.onCancel}
                      size="sm"
                      variant="destructive"
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
        onCancel={props.onCancel}
        onDone={props.onDone}
        signPhraseType={props.signPhraseType}
      />
    </SignDetectorRoot>
  );
};
