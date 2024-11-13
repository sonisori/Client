import { onMount } from "solid-js";

export const onMountAsync = (callback: () => Promise<void>) => {
  const ref: { promise?: Promise<void> } = {};
  onMount(() => {
    ref.promise = callback();
  });
  return ref;
};
