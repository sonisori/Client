import { useNavigate, useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";

import { SignPhraseType } from "../../service/type/phrase";
import { client } from "../../service/util/api";
import { cn } from "../../service/util/cn";
import { Button } from "../component/base/Button";
import { Progress } from "../component/base/Progress";
import { SignDetector } from "../component/domain/SignDetector";

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

const TimerStatstics = (props: {
  comment: string;
  done: boolean;
  title: string;
}) => {
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

  createEffect(() => {
    if (props.done) {
      clearTimeout(timer);
    }
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

const checkSentence = async (
  sentence: string,
  sign: { phraseType: SignPhraseType; words: string[] },
) => {
  /**
   * @todo ai 서버 마이그레이션 후 로직 수정
   */
  return sentence === sign.words.join(" ") || sentence.includes(".");
};

export const Learning = () => {
  const [quiz, setQuiz] = createStore({
    index: 0,
    history: [] as History[],
    done: false,
  });

  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = createSignal(false);

  const [data] = createResource(() =>
    client
      .get(`api/topics/${params.id}/quizzes`)
      .json<{ quizId: number; sentence: string }[]>(),
  );

  const precision = () =>
    quiz.history.length === 0
      ? 100
      : Math.round(
          (quiz.history.filter((v) => v === History.CORRECT).length /
            quiz.history.length) *
            100,
        );

  return (
    <Show when={data()}>
      {(data) => (
        <div class="fixed inset-y-0 left-72 right-0">
          <SignDetector
            disabled={loading()}
            key={quiz.index}
            onDone={(words) => {
              if (loading()) return;
              setLoading(true);
              checkSentence(data()[quiz.index].sentence, {
                phraseType: "평서문",
                words,
              })
                .then((result) => {
                  const done = quiz.index + 1 === data().length;
                  setQuiz((prev) => ({
                    index: done ? prev.index : prev.index + 1,
                    history: [
                      ...prev.history,
                      result ? History.CORRECT : History.INCORRECT,
                    ],
                    done,
                  }));
                  if (done) {
                    return client.post(`api/topics/${params.id}/result`, {
                      json: {
                        correctCount: quiz.history.filter(
                          (v) => v === History.CORRECT,
                        ).length,
                      },
                    });
                  }
                })
                .finally(() => setLoading(false));
            }}
            open={!quiz.done}
            signPhraseType="평서문"
          />
          <div
            class={cn(
              "absolute inset-0 flex flex-col",
              quiz.done && "justify-center",
            )}
            style={quiz.done ? { top: 0 } : { top: "calc(50vh + 70px)" }}
          >
            <Show
              fallback={
                <p class="pb-12 pl-7 text-2xl font-medium text-gray-900">
                  완료: 학교에서 만났을 때
                </p>
              }
              when={!quiz.done}
            >
              <p class="p-7 text-xl font-medium text-gray-900">
                <span class="mr-8 text-xl text-muted-foreground">
                  제시 문장:
                </span>
                {data()[quiz.index].sentence}
              </p>
            </Show>
            <div
              class={cn(
                "flex items-center justify-between gap-7 px-7 pb-7",
                !quiz.done && "flex-1",
              )}
            >
              <ProgressStatstics
                comment="거의 다 왔어요"
                label={`${quiz.index + 1} / ${data().length}`}
                ratio={((quiz.index + 1) / data().length) * 100}
                title="진행도"
              />
              <ProgressStatstics
                comment="잘하고 있어요"
                label={precision() + "%"}
                ratio={precision()}
                title="정확도"
              />
              <TimerStatstics
                comment="잘하고 있어요"
                done={quiz.done}
                title="진행 시간"
              />
            </div>
            <Show when={quiz.done}>
              <div class="flex justify-end px-7 pt-5">
                <Button onClick={() => navigate(-1)}>완료</Button>
              </div>
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
};
