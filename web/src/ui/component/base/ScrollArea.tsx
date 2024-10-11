import {
  createElementSize,
  NullableSize,
} from "@solid-primitives/resize-observer";
import { useMachine } from "@xstate/solid";
import { cva, VariantProps } from "class-variance-authority";
import { createEffect, createSignal, JSXElement, on, Show } from "solid-js";
import { assertEvent, assign, setup } from "xstate";

import { cn } from "../../../service/util/cn";

const DELAY = 1000;

const widthOf = (size: NullableSize, defaultValue: number = 0) =>
  size.width ?? defaultValue;

const scrollAreaMachine = setup({
  types: {} as {
    input: {
      offset: number;
      showScrollbar: boolean;
    };
    context: {
      offset: number;
      showScrollbar: boolean;
    };
    events:
      | {
          type:
            | "POINTER_ENTER"
            | "POINTER_LEAVE"
            | "POINTER_ACTIVE"
            | "POINTER_INACTIVE"
            | "SCROLL_START";
        }
      | {
          type: "SET_OFFSET";
          offset: number;
        };
  },
  actions: {
    showScrollbar: assign({ showScrollbar: true }),
    hideScrollbar: assign({ showScrollbar: false }),
    setOffset: assign({
      offset: ({ event }) => {
        assertEvent(event, "SET_OFFSET");
        return event.offset;
      },
    }),
  },
}).createMachine({
  initial: "hidden",
  context: ({ input }) => ({
    offset: input.offset,
    showScrollbar: input.showScrollbar,
  }),
  states: {
    hidden: {
      on: {
        POINTER_ENTER: "visible",
        SET_OFFSET: { actions: "setOffset" },
      },
      after: {
        [DELAY]: { actions: "hideScrollbar" },
      },
    },
    visible: {
      always: {
        guard: ({ context }) => !context.showScrollbar,
        actions: "showScrollbar",
      },
      on: {
        SCROLL_START: "scrolling",
        POINTER_ACTIVE: "interacting",
        POINTER_LEAVE: "hidden",
      },
    },
    scrolling: {
      on: {
        POINTER_LEAVE: "hidden",
        SET_OFFSET: {
          actions: "setOffset",
          target: "scrolling",
          reenter: true,
        },
      },
      after: {
        [DELAY]: { target: "visible" },
      },
    },
    interacting: {
      on: {
        POINTER_INACTIVE: "visible",
        POINTER_LEAVE: "hidden",
        SET_OFFSET: { actions: "setOffset" },
      },
    },
  },
});

const scrollAreaVariant = cva("relative", {
  variants: {
    direction: {
      x: "overflow-x-hidden",
      y: "overflow-y-hidden",
    },
  },
  defaultVariants: {
    direction: "y",
  },
});

const scrollBarVariant = cva("absolute transition-opacity duration-500", {
  variants: {
    direction: {
      x: "bottom-0.5 inset-x-0.5",
      y: "right-0 inset-y-0 w-2",
    },
  },
  defaultVariants: {
    direction: "y",
  },
});

export const ScrollArea = (
  props: {
    children: JSXElement;
    class?: string;
    defaultOffset?: number;
  } & VariantProps<typeof scrollAreaVariant>,
) => {
  const [childrenContainer, setChildrenContainer] =
    createSignal<HTMLDivElement>();
  const [scrollAreaContainer, setScrollAreaContainer] =
    createSignal<HTMLDivElement>();

  const childrenSize = createElementSize(childrenContainer);
  const containerSize = createElementSize(scrollAreaContainer);

  const getSafeOffset = (offset: number) => {
    const maxOffset = widthOf(childrenSize) - widthOf(containerSize) - 4;
    return Math.min(maxOffset, Math.max(0, offset));
  };

  const [snapshot, send] = useMachine(scrollAreaMachine, {
    input: {
      offset: getSafeOffset(props.defaultOffset ?? 0),
      showScrollbar: false,
    },
  });

  const scrollHandleSize = () =>
    (widthOf(containerSize) * widthOf(containerSize)) /
      widthOf(childrenSize, 1) -
    4;

  const showScrollbar = () => widthOf(childrenSize) > widthOf(containerSize);

  const handleScroll = (e: WheelEvent) => {
    if (!snapshot.matches("scrolling")) {
      send({ type: "SCROLL_START" });
      return;
    }
    send({
      type: "SET_OFFSET",
      offset: getSafeOffset(snapshot.context.offset + e.deltaX),
    });
  };

  createEffect(
    on(
      () => [containerSize.width],
      () => {
        send({
          type: "SET_OFFSET",
          offset: getSafeOffset(props.defaultOffset ?? 0),
        });
      },
    ),
  );

  createEffect(() => {
    send({
      type: "SET_OFFSET",
      offset: getSafeOffset(props.defaultOffset ?? 0),
    });
  });

  return (
    <div
      ref={setScrollAreaContainer}
      onMouseEnter={() => send({ type: "POINTER_ENTER" })}
      onMouseLeave={() => send({ type: "POINTER_LEAVE" })}
      onWheel={(e) => {
        e.preventDefault();
        handleScroll(e);
      }}
      class={cn(scrollAreaVariant({ direction: props.direction }), props.class)}
    >
      <div
        ref={setChildrenContainer}
        class={cn("min-w-max", {
          "transition-transform duration-500": snapshot.matches("hidden"),
        })}
        style={{ transform: `translateX(${-snapshot.context.offset}px)` }}
      >
        {props.children}
      </div>
      <Show when={showScrollbar()}>
        <div
          class={cn(scrollBarVariant({ direction: props.direction }), {
            "opacity-0": !snapshot.context.showScrollbar,
          })}
        >
          <div
            class={cn("h-1.5 rounded-full bg-border", {
              "transition-transform duration-500": snapshot.matches("hidden"),
            })}
            style={{
              width: `${scrollHandleSize()}px`,
              transform: `translateX(${
                (snapshot.context.offset /
                  (widthOf(childrenSize) - widthOf(containerSize))) *
                (widthOf(containerSize) - scrollHandleSize())
              }px)`,
            }}
          />
        </div>
      </Show>
    </div>
  );
};
