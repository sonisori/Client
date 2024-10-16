import { TextField } from "@kobalte/core/text-field";
import { cva } from "class-variance-authority";
import { createSignal, Show } from "solid-js";

import { type Phrase } from "../../../service/type/phrase";
import { cn } from "../../../service/util/cn";
import { Check } from "../../icon/Check";
import { Pencil } from "../../icon/Pencil";
import { Button } from "../base/Button";

const bubbleVariants = cva(
  "max-w-[512px] rounded-2xl px-2 py-1.5 break-all whitespace-pre-line",
  {
    variants: {
      author: {
        left: "rounded-bl-none bg-accent-foreground/80 pr-3 text-accent",
        right: "rounded-br-none bg-accent pl-3 text-accent-foreground",
      },
    },
  },
);

export const PhraseBubble = (props: {
  phrase: Phrase;
  onEdit: (phrase: Phrase) => void;
}) => {
  const [text, setText] = createSignal<string | null>(null);
  const mode = () => (typeof text() === "string" ? "edit" : "view");
  return (
    <div
      class={cn("group flex justify-start gap-1", {
        "flex-row-reverse": props.phrase.author === "right",
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
              onClick={() => {
                setText(props.phrase.text);
              }}
              class="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <Pencil />
            </Button>
          </>
        }
      >
        <TextField value={text() as string} onChange={setText}>
          <TextField.TextArea
            autoResize
            class={cn(bubbleVariants({ author: props.phrase.author }), "w-80")}
          />
        </TextField>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            props.onEdit({ ...props.phrase, text: text() as string });
            setText(null);
          }}
        >
          <Check />
        </Button>
      </Show>
    </div>
  );
};
