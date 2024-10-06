import { createWindowSize } from "@solid-primitives/resize-observer";
import { JSXElement, Show } from "solid-js";

import { MIN_WIDTH, SERVICE_NAME } from "../../service/constant/domain";

export const ViewportLayout = (props: { children: JSXElement }) => {
  const size = createWindowSize();
  const isVisible = () => size.width >= MIN_WIDTH;
  return (
    <>
      <Show when={isVisible()}>{props.children}</Show>
      <Show when={!isVisible()}>
        <p class="p-5 text-lg">
          {SERVICE_NAME}은 {MIN_WIDTH}px 이상의 너비를 가진 디바이스에서
          사용가능합니다.
        </p>
      </Show>
    </>
  );
};
