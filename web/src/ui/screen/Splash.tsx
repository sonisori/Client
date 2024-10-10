import { createSignal, JSXElement, Show } from "solid-js";

import { SERVICE_NAME } from "../../service/constant/domain";

export const Splash = (props: { children: JSXElement }) => {
  const [loading, setLoading] = createSignal(false);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <Show when={loading()} fallback={props.children}>
      <div class="fixed inset-0 flex items-center justify-center bg-white">
        <div class="grid grid-cols-2 items-center justify-items-end gap-10">
          <div class="size-32 bg-gray-200" />
          <h1 class="text-6xl font-semibold">{SERVICE_NAME}</h1>
        </div>
      </div>
    </Show>
  );
};
