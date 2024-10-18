import { cva } from "class-variance-authority";
import { createSignal, Show } from "solid-js";

import { type Phrase } from "../../../service/type/phrase";
import { cn } from "../../../service/util/cn";

const bubbleVariants = cva(
  "max-w-[512px] rounded-2xl px-2 py-1.5 break-all whitespace-pre-wrap",
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
  autoFocus?: boolean;
  phrase: Phrase;
}) => {
  // eslint-disable-next-line solid/reactivity
  const [text, setText] = createSignal(props.phrase.text);

  return (
    <div
      class={cn("group flex justify-start gap-1", {
        "flex-row-reverse": props.phrase.author === "right",
      })}
    >
      <div class="relative">
        {/* trick: p 의 사이즈를 따르도록 한다. */}
        {/* text == '' 일때는 placeholder를 표시하기 위해 p를 무시한다. */}
        {/* fix: 문자열이 개행으로 끝나는 경우 높이가 늘어나지 않음 */}
        <Show when={text()}>
          <p
            aria-hidden
            class={cn(
              bubbleVariants({ author: props.phrase.author }),
              "invisible",
            )}
          >
            {text()}
          </p>
        </Show>
        <textarea
          class={cn(
            bubbleVariants({ author: props.phrase.author }),
            text() ? "absolute inset-0" : "h-9",
            "block overflow-hidden",
            "outline-none",
            "resize-none",
          )}
          onInput={(e) => setText(e.currentTarget.value)}
          placeholder="텍스트를 입력하세요"
          ref={(el) => {
            if (props.autoFocus) {
              setTimeout(() => {
                el.focus();
              }, 200);
            }
          }}
          value={text()}
        />
      </div>
    </div>
  );
};
