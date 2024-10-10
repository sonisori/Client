import { createElementSize } from "@solid-primitives/resize-observer";
import { useActor } from "@xstate/solid";
import { cva, VariantProps } from "class-variance-authority";
import { createEffect, createSignal, JSXElement } from "solid-js";
import { assertEvent, assign, setup } from "xstate";

import { MIN_WIDTH } from "../../../service/constant/domain";
import { cn } from "../../../service/util/cn";

const DELAY = 1000;

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

const scrollBarVariant = cva("group absolute bg-accent hover:bg-red-500", {
  variants: {
    direction: {
      x: "bottom-0 inset-x-0 h-2",
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

  const handleScroll = (e: WheelEvent) => {
    if (snapshot.matches("scrolling")) {
      const maxOffset =
        typeof childrenSize.width === "number" &&
        typeof containerSize.width === "number"
          ? childrenSize.width - containerSize.width
          : MIN_WIDTH;
      send({
        type: "SET_OFFSET",
        offset: Math.min(
          maxOffset,
          Math.max(0, snapshot.context.offset + e.deltaX),
        ),
      });
      return;
    }
    send({ type: "SCROLL_START" });
  };

  createEffect(() => {
    console.log(snapshot.value);
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
        class="min-w-max"
        style={{ transform: `translateX(${-snapshot.context.offset}px)` }}
      >
        {props.children}
      </div>
      <div
        class={cn(scrollBarVariant({ direction: props.direction }), {
          invisible: !snapshot.context.showScrollbar,
        })}
      >
        <div class="handle" />
      </div>
    </div>
  );
};
