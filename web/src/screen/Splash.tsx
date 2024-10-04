import { createSignal, JSXElement, Show } from "solid-js";

export const Splash = (props: { children: JSXElement }) => {
  const [loading, setLoading] = createSignal(true);

  setTimeout(() => {
    // setLoading(false);
  }, 2000);

  return (
    <>
      <Show when={loading()}>
        <div class="fixed inset-0 flex items-center justify-center bg-gray-50">
          <div class="grid grid-cols-2 items-center justify-items-end gap-10">
            <div class="size-32 bg-gray-200" />
            <h1 class="text-6xl font-semibold">SoniSori</h1>
          </div>
        </div>
      </Show>
      <Show when={!loading()}>{props.children}</Show>
    </>
  );
};
