import {
  createElementSize,
  NullableSize,
} from "@solid-primitives/resize-observer";
import { useMachine } from "@xstate/solid";
import { cva } from "class-variance-authority";
import {
  createEffect,
  createSignal,
  JSX,
  JSXElement,
  on,
  Show,
} from "solid-js";
import { assertEvent, assign, setup } from "xstate";

import { cn } from "../../../service/util/cn";

const DELAY = 1000;

const TRANSLATE_MAP = { x: "translateX", y: "translateY" } as const;
const SIZE_MAP = { x: "width", y: "height" } as const;
const DELTA_MAP = { x: "deltaX", y: "deltaY" } as const;
const MOVEMENT_MAP = { x: "movementX", y: "movementY" } as const;

const scrollAreaMachine = setup({
  types: {} as {
    context: {
      offset: number;
      showScrollbar: boolean;
    };
    events:
      | {
          offset: number;
          type: "SET_OFFSET";
        }
      | {
          type:
            | "POINTER_ACTIVE"
            | "POINTER_ENTER"
            | "POINTER_INACTIVE"
            | "POINTER_LEAVE"
            | "SCROLL_START";
        };
    input: {
      offset: number;
      showScrollbar: boolean;
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
        SET_OFFSET: { actions: "setOffset" },
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
});

const scrollBarVariant = cva("absolute", {
  variants: {
    direction: {
      x: "bottom-0.5 inset-x-0.5",
      y: "right-0.5 inset-y-0.5",
    },
  },
});

export const ScrollArea = (props: {
  children: JSXElement;
  class?: string;
  defaultOffset?: number;
  direction: "x" | "y";
  disableAnimation?: boolean;
  style?: JSX.CSSProperties;
}) => {
  const [childrenContainer, setChildrenContainer] =
    createSignal<HTMLDivElement>();
  const [scrollAreaContainer, setScrollAreaContainer] =
    createSignal<HTMLDivElement>();

  const childrenSize = createElementSize(childrenContainer);
  const containerSize = createElementSize(scrollAreaContainer);

  const sizeOf = (size: NullableSize, defaultValue: number = 0) =>
    size[SIZE_MAP[props.direction]] ?? defaultValue;

  const getSafeOffset = (offset: number) => {
    const maxOffset = sizeOf(childrenSize) - sizeOf(containerSize) - 4;
    return Math.min(maxOffset, Math.max(0, offset));
  };

  const [snapshot, send] = useMachine(scrollAreaMachine, {
    input: {
      offset: getSafeOffset(props.defaultOffset ?? 0),
      showScrollbar: false,
    },
  });

  const scrollHandleSize = () =>
    (sizeOf(containerSize) * sizeOf(containerSize)) / sizeOf(childrenSize, 1) -
    4;

  const showScrollbar = () => sizeOf(childrenSize) > sizeOf(containerSize);

  const handleScroll = (e: WheelEvent) => {
    if (!snapshot.matches("scrolling")) {
      send({ type: "SCROLL_START" });
      return;
    }
    send({
      type: "SET_OFFSET",
      offset: getSafeOffset(
        snapshot.context.offset + e[DELTA_MAP[props.direction]],
      ),
    });
  };

  createEffect(
    on(
      () => [containerSize[SIZE_MAP[props.direction]]],
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

  const handlePointerMove = (e: PointerEvent) => {
    const ratio =
      (1 / (sizeOf(containerSize) - 4 - scrollHandleSize())) *
      (sizeOf(childrenSize) - sizeOf(containerSize));
    send({
      type: "SET_OFFSET",
      offset: getSafeOffset(
        snapshot.context.offset + e[MOVEMENT_MAP[props.direction]] * ratio,
      ),
    });
  };
  createEffect(
    on(
      () => snapshot.matches("interacting"),
      () => {
        if (snapshot.matches("interacting")) {
          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener(
            "pointerup",
            () => {
              send({ type: "POINTER_INACTIVE" });
            },
            { once: true },
          );
        } else {
          window.removeEventListener("pointermove", handlePointerMove);
          document.body.style.userSelect = "auto";
        }
      },
    ),
  );

  return (
    <div
      class={cn(scrollAreaVariant({ direction: props.direction }), props.class)}
      onMouseEnter={() => send({ type: "POINTER_ENTER" })}
      onMouseLeave={() => send({ type: "POINTER_LEAVE" })}
      onWheel={(e) => {
        e.preventDefault();
        handleScroll(e);
      }}
      ref={setScrollAreaContainer}
      style={props.style}
    >
      <div
        class={cn({
          "transition-transform duration-500":
            !props.disableAnimation &&
            (snapshot.matches("hidden") || snapshot.matches("visible")),
          "min-w-max": props.direction === "x",
          "min-h-max": props.direction === "y",
        })}
        ref={setChildrenContainer}
        style={{
          transform: `${TRANSLATE_MAP[props.direction]}(${-snapshot.context.offset}px)`,
        }}
      >
        {props.children}
      </div>
      <Show when={showScrollbar()}>
        <div class={cn(scrollBarVariant({ direction: props.direction }))}>
          <div
            class={cn(
              "rounded-full bg-black opacity-10 transition-opacity duration-200 hover:opacity-30",
              {
                "opacity-0": !snapshot.context.showScrollbar,
                "h-1.5": props.direction === "x",
                "w-1.5": props.direction === "y",
                "opacity-30": snapshot.matches("interacting"),
              },
            )}
            onPointerDown={() => {
              send({ type: "POINTER_ACTIVE" });
              document.body.style.userSelect = "none";
            }}
            style={{
              [SIZE_MAP[props.direction]]: `${scrollHandleSize()}px`,
              transform: `${TRANSLATE_MAP[props.direction]}(${
                (snapshot.context.offset /
                  (sizeOf(childrenSize) - sizeOf(containerSize))) *
                (sizeOf(containerSize) - scrollHandleSize())
              }px)`,
            }}
          />
        </div>
      </Show>
    </div>
  );
};
