import { createElementSize } from "@solid-primitives/resize-observer";
import { useMachine } from "@xstate/solid";
import { cva } from "class-variance-authority";
import { createSignal, JSX, JSXElement, Show } from "solid-js";
import { assign, setup } from "xstate";

import { cn } from "../../../service/util/cn";

type Direction = "horizontal" | "vertical";

const scrollAreaMachine = setup({
  types: {
    context: {} as {
      offset: number;
      showScrollbar: boolean;
    },
    events: {} as
      | { offset: number; type: "SET_OFFSET" }
      | { pointerOnViewport: boolean; type: "DRAG_END" }
      | { type: "DRAG_START" | "POINTER_ENTER" | "POINTER_LEAVE" },
  },
}).createMachine({
  context: {
    showScrollbar: false,
    offset: 0,
  },
  on: {
    SET_OFFSET: {
      actions: assign({
        offset: ({ event }) => event.offset,
      }),
    },
  },
  initial: "out",
  states: {
    out: {
      on: {
        POINTER_ENTER: "in",
      },
      after: {
        500: {
          actions: assign({ showScrollbar: false }),
        },
      },
    },
    in: {
      always: {
        guard: ({ context }) => !context.showScrollbar,
        actions: assign({ showScrollbar: true }),
      },
      on: {
        POINTER_LEAVE: "out",
        DRAG_START: "dragging",
      },
    },
    dragging: {
      on: {
        DRAG_END: [
          { target: "in", guard: ({ event }) => event.pointerOnViewport },
          { target: "out", guard: ({ event }) => !event.pointerOnViewport },
        ],
      },
    },
  },
});

const scrollAreaVariant = cva("scrollbar-hide size-full", {
  variants: {
    direction: {
      vertical: "overflow-y-scroll",
      horizontal: "overflow-x-scroll",
    },
  },
});

const scrollbarContainerVariant = cva("absolute", {
  variants: {
    direction: {
      vertical: "inset-y-0.5 right-0.5",
      horizontal: "inset-x-0.5 bottom-0.5",
    },
  },
});

const scrollBarVariant = cva(
  "bg-black opacity-10 hover:opacity-30 transition-opacity duration-200 rounded-full",
  {
    variants: {
      direction: {
        vertical: "w-1.5",
        horizontal: "h-1.5",
      },
    },
  },
);

const useElementSize = () => {
  const [element, setElement] = createSignal<HTMLDivElement>();
  const size = createElementSize(element);

  return [
    setElement,
    {
      width: (defaultWidth: number = 0) => size.width ?? defaultWidth,
      height: (defaultHeight: number = 0) => size.height ?? defaultHeight,
    },
    element,
  ] as const;
};

const SCROLL_OFFSET_MAP = {
  horizontal: "scrollLeft",
  vertical: "scrollTop",
} as const;

const SIZE_MAP = {
  horizontal: "width",
  vertical: "height",
} as const;

const TRANSLATE_MAP = {
  horizontal: "translateX",
  vertical: "translateY",
} as const;

const CLIENT_MAP = {
  horizontal: "clientX",
  vertical: "clientY",
} as const;

export const ScrollArea = (props: {
  children: JSXElement;
  class?: string;
  direction: Direction;
  style?: JSX.CSSProperties;
  viewportRef?: (el: HTMLDivElement) => void;
}) => {
  const [snapshot, send] = useMachine(scrollAreaMachine);

  const [root, setRoot] = createSignal<HTMLDivElement>();
  const [setViewport, viewportSize, viewport] = useElementSize();
  const [setContainer, containerSize] = useElementSize();

  const showScrollbar = () =>
    containerSize[SIZE_MAP[props.direction]]() >
    viewportSize[SIZE_MAP[props.direction]]();

  const thumbSize = () =>
    ((viewportSize[SIZE_MAP[props.direction]]() - 4) *
      viewportSize[SIZE_MAP[props.direction]]()) /
    containerSize[SIZE_MAP[props.direction]](1);

  const thumbTranslate = () =>
    (snapshot.context.offset /
      (containerSize[SIZE_MAP[props.direction]]() -
        viewportSize[SIZE_MAP[props.direction]]())) *
    (viewportSize[SIZE_MAP[props.direction]]() - 4 - thumbSize());

  const onDragStart = (e: MouseEvent) => {
    send({ type: "DRAG_START" });
    document.body.style.userSelect = "none";

    const startClient = e[CLIENT_MAP[props.direction]];
    const startScroll = viewport()![SCROLL_OFFSET_MAP[props.direction]];

    const onPointerMove = (e: PointerEvent) => {
      const ratio =
        (1 / (viewportSize[SIZE_MAP[props.direction]]() - 4 - thumbSize())) *
        (containerSize[SIZE_MAP[props.direction]]() -
          viewportSize[SIZE_MAP[props.direction]]());
      viewport()![SCROLL_OFFSET_MAP[props.direction]] =
        startScroll + (e[CLIENT_MAP[props.direction]] - startClient) * ratio;
      send({
        type: "SET_OFFSET",
        offset: viewport()![SCROLL_OFFSET_MAP[props.direction]],
      });
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener(
      "pointerup",
      (e) => {
        document.removeEventListener("pointermove", onPointerMove);
        document.body.style.userSelect = "auto";
        send({
          type: "DRAG_END",
          pointerOnViewport: root()!.contains(e.target as Node),
        });
      },
      { once: true },
    );
  };

  return (
    <div
      class={cn("relative", props.class)}
      onPointerEnter={() => send({ type: "POINTER_ENTER" })}
      onPointerLeave={() => send({ type: "POINTER_LEAVE" })}
      ref={setRoot}
      style={props.style}
    >
      <div
        class={scrollAreaVariant({ direction: props.direction })}
        onScroll={(e) =>
          send({
            type: "SET_OFFSET",
            offset: e.currentTarget[SCROLL_OFFSET_MAP[props.direction]],
          })
        }
        ref={(ref) =>
          [setViewport, props.viewportRef].forEach((fn) => fn?.(ref))
        }
      >
        <div
          class={cn({ "w-fit": props.direction === "horizontal" })}
          ref={setContainer}
        >
          {props.children}
        </div>
      </div>
      <Show when={showScrollbar()}>
        <div class={scrollbarContainerVariant({ direction: props.direction })}>
          <div
            class={cn(scrollBarVariant({ direction: props.direction }), {
              "opacity-0": !snapshot.context.showScrollbar,
              "opacity-30": snapshot.matches("dragging"),
            })}
            onMouseDown={onDragStart}
            style={{
              [SIZE_MAP[props.direction]]: `${thumbSize()}px`,
              transform: `${TRANSLATE_MAP[props.direction]}(${thumbTranslate()}px)`,
            }}
          />
        </div>
      </Show>
    </div>
  );
};
