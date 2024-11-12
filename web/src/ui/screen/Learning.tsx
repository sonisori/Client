import { createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { Progress } from "../component/base/Progress";
import { SignDetector } from "../component/domain/SignDetector";
import { MenuLayout } from "../layout/MenuLayout";

const quizes = [
  {
    type: "감탄문",
    phrase: "나는 오늘 기분이 좋다.",
  },
  {
    type: "평서문",
    phrase: "나는 오늘 기분이 안좋다.",
  },
  {
    type: "의문문",
    phrase: "내가 오늘 기분이 안좋나?",
  },
] as const;

enum History {
  CORRECT,
  INCORRECT,
  SKIP,
}

const ProgressStatstics = (props: {
  comment: string;
  label: string;
  ratio: number;
  title: string;
}) => {
  return (
    <div class="max-w-72 flex-1">
      <div class="flex justify-between pb-2">
        <h2 class="text-sm font-medium text-primary">{props.title}</h2>
        <p class="text-sm text-muted-foreground">{props.label}</p>
      </div>
      <Progress class="w-full" value={props.ratio} />
      <p class="pt-1 text-xs text-muted-foreground">{props.comment}</p>
    </div>
  );
};

const TimerStatstics = (props: { comment: string; title: string }) => {
  let timer!: ReturnType<typeof setTimeout>;
  const startTime = Date.now();

  const [time, setTime] = createSignal("00:00");

  onMount(() => {
    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setTime(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    }, 1000);
  });

  onCleanup(() => {
    clearTimeout(timer);
  });

  return (
    <div class="h-14 max-w-72 flex-1">
      <div class="flex items-baseline justify-between">
        <h2 class="text-sm font-medium text-primary">{props.title}</h2>
        <p class="font-medium text-primary">{time()}</p>
      </div>
      <p class="pt-4 text-xs text-muted-foreground">{props.comment}</p>
    </div>
  );
};

export const Learning = () => {
  const [quiz, setQuiz] = createStore({
    index: 0,
    history: [] as History[],
  });

  const precision = () =>
    quiz.history.length === 0
      ? 100
      : (quiz.history.filter((v) => v === History.CORRECT).length /
          quiz.history.length) *
        100;

  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <SignDetector
          key={quiz.index}
          onDone={() =>
            setQuiz((prev) => ({
              index: prev.index + 1,
              history: [...prev.history, History.SKIP],
            }))
          }
          open
          signPhraseType={quizes[quiz.index].type}
        />
        <div
          class="absolute inset-0 flex flex-col"
          style={{ top: "calc(50vh + 70px)" }}
        >
          <p class="p-7 text-xl font-medium text-gray-900">
            <span class="mr-8 text-xl text-muted-foreground">제시 문장:</span>
            {quizes[quiz.index].phrase}
          </p>
          <div class="flex flex-1 items-center justify-between gap-7 px-7 pb-7">
            <ProgressStatstics
              comment="거의 다 왔어요"
              label={`${quiz.index + 1} / ${quizes.length}`}
              ratio={((quiz.index + 1) / quizes.length) * 100}
              title="진행도"
            />
            <ProgressStatstics
              comment="잘하고 있어요"
              label={precision() + "%"}
              ratio={precision()}
              title="정확도"
            />
            <TimerStatstics comment="잘하고 있어요" title="진행 시간" />
          </div>
        </div>
      </div>
    </MenuLayout>
  );
};
