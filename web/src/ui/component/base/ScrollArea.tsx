import {
  createElementSize,
  NullableSize,
} from "@solid-primitives/resize-observer";
import { useActor } from "@xstate/solid";
import { cva, VariantProps } from "class-variance-authority";
import { createEffect, createSignal, JSXElement, on } from "solid-js";
import { assertEvent, assign, setup } from "xstate";

import { cn } from "../../../service/util/cn";

const DELAY = 1000;

const widthOf = (size: NullableSize, defaultValue: number = 0) =>
  size.width ?? defaultValue;

const scrollAreaMachine = setup({
  types: {} as {
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
  context: {
    offset: 0,
    showScrollbar: false,
  },
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
  props: { children: JSXElement; class?: string } & VariantProps<
    typeof scrollAreaVariant
  >,
) => {
  const [childrenContainer, setChildrenContainer] =
    createSignal<HTMLDivElement>();
  const [scrollAreaContainer, setScrollAreaContainer] =
    createSignal<HTMLDivElement>();

  const [snapshot, send] = useActor(scrollAreaMachine);

  const childrenSize = createElementSize(childrenContainer);
  const containerSize = createElementSize(scrollAreaContainer);

  const scrollHandleSize = () =>
    (widthOf(containerSize) * widthOf(containerSize)) /
      widthOf(childrenSize, 1) -
    4;

  const handleScroll = (e: WheelEvent) => {
    if (!snapshot.matches("scrolling")) {
      send({ type: "SCROLL_START" });
      return;
    }

    const maxOffset = widthOf(childrenSize) - widthOf(containerSize) - 4;

    send({
      type: "SET_OFFSET",
      offset: Math.min(
        maxOffset,
        Math.max(0, snapshot.context.offset + e.deltaX),
      ),
    });
  };

  createEffect(
    on(
      () => [containerSize.width],
      () => {
        send({ type: "SET_OFFSET", offset: 0 });
      },
    ),
  );

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
        class="min-w-max"
        style={{ transform: `translateX(${-snapshot.context.offset}px)` }}
      >
        {props.children}
      </div>
      <div
        class={cn(scrollBarVariant({ direction: props.direction }), {
          "opacity-0": !snapshot.context.showScrollbar,
        })}
      >
        <div
          class="h-1.5 rounded-full bg-border"
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
    </div>
  );
};
