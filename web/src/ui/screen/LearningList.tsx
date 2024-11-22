import { For, Match, Switch } from "solid-js";

import { Progress } from "../component/base/Progress";
import { Check } from "../icon/Check";

const Card = (props: {
  description: string;
  id: number;
  progress: null | number;
  title: string;
  total: number;
}) => {
  return (
    <a href={`/app/learning/${props.id}`}>
      <div class="rounded-lg p-5 transition-all hover:bg-accent hover:text-accent-foreground">
        <h2 class="text-lg font-medium">{props.title}</h2>
        <p class="text-sm text-muted-foreground">{props.description}</p>
        <Switch fallback={<div class="h-8" />}>
          <Match when={props.progress === props.total}>
            <div class="flex items-center gap-1 pt-4 text-sm font-light text-green-500">
              <Check />
              완료함
            </div>
          </Match>
          <Match when={typeof props.progress === "number"}>
            <div class="flex items-center gap-2 pt-4">
              <Progress
                class="w-24"
                maxValue={props.total}
                value={props.progress!}
              />
              <p class="text-xs text-muted-foreground">
                {props.progress}/{props.total}
              </p>
            </div>
          </Match>
        </Switch>
      </div>
    </a>
  );
};

export const LearningList = () => {
  const cards = [
    {
      id: 1,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
      progress: null,
      total: 10,
    },
    {
      id: 2,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
      progress: 8,
      total: 10,
    },
    {
      id: 3,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
      progress: 7,
      total: 10,
    },
    {
      id: 3,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
      progress: null,
      total: 10,
    },
    {
      id: 3,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
      progress: 10,
      total: 10,
    },
  ];
  return (
    <div class="fixed inset-y-0 left-72 right-0 overflow-y-scroll">
      <div class="px-20 py-12">
        <div class="pl-5">
          <h1 class="text-xl font-semibold">수어 퀴즈</h1>
          <p class="text text-muted-foreground">수어로 문장 만들어보기</p>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-10">
          <For each={cards}>{(card) => <Card {...card} />}</For>
        </div>
      </div>
    </div>
  );
};
