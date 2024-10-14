import { cva } from "class-variance-authority";
import { createSignal, Show } from "solid-js";

import { type Phrase } from "../../../service/type/phrase";
import { cn } from "../../../service/util/cn";
import { Check } from "../../icon/Check";
import { Pencil } from "../../icon/Pencil";
import { Button } from "../base/Button";

const bubbleVariants = cva("max-w-[512px] rounded-2xl px-2 py-1.5 w-max", {
  variants: {
    author: {
      left: "rounded-bl-none bg-accent-foreground/80 pr-3 text-accent",
      right: "rounded-br-none bg-accent pl-3 text-accent-foreground",
    },
  },
});

export const PhraseBubble = (props: { phrase: Phrase }) => {
  const [mode, setMode] = createSignal<"view" | "edit">("view");
  return (
    <div
      class={cn("group flex gap-1", {
        "justify-start": props.phrase.author === "left",
        "justify-end": props.phrase.author === "right",
      })}
    >
      <Show
        when={mode() === "edit"}
        fallback={
          <>
            <p class={cn(bubbleVariants({ author: props.phrase.author }))}>
              {props.phrase.text}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("edit")}
              class="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <Pencil />
            </Button>
          </>
        }
      >
        <textarea
          value={props.phrase.text}
          class={cn(bubbleVariants({ author: props.phrase.author }))}
        />
        <Button variant="ghost" size="icon" onClick={() => setMode("view")}>
          <Check />
        </Button>
      </Show>
    </div>
  );
};
