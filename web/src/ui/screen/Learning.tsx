import { For } from "solid-js";

import { MenuLayout } from "../layout/MenuLayout";

const Card = (props: { description: string; id: number; title: string }) => {
  return (
    <a href={`/learning/${props.id}`}>
      <div class="rounded-lg p-5 pb-9 transition-all hover:bg-accent hover:text-accent-foreground">
        <h2 class="text-lg font-medium">{props.title}</h2>
        <p class="text-sm text-muted-foreground">{props.description}</p>
      </div>
    </a>
  );
};

export const Learning = () => {
  const cards = [
    {
      id: 1,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
    },
    {
      id: 2,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
    },
    {
      id: 3,
      title: "학교에서 만났을 때",
      description: "새 학기 수어를 사용하는 친구에게 먼저 말을 걸어보세요",
    },
  ];
  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <div class="px-20 py-12">
          <div class="pl-5">
            <h1 class="text-xl font-semibold">수어 학습</h1>
            <p class="text text-muted-foreground">AI와 함께 배우는 수어</p>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-10">
            <For each={cards}>{(card) => <Card {...card} />}</For>
          </div>
        </div>
      </div>
    </MenuLayout>
  );
};
