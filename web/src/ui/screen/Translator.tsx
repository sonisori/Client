import { onMount } from "solid-js";

import { Badge } from "../component/base/Badge";
import { MenuLayout } from "../layout/MenuLayout";

export const Translator = () => {
  let videoRef!: HTMLVideoElement;

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.srcObject = stream;
      videoRef.addEventListener("loadeddata", console.log);
    });
  });

  return (
    <MenuLayout>
      <div class="inset-top-0 fixed left-72 right-0">
        <div class="flex h-[50vh] justify-center bg-gray-50">
          <video
            ref={videoRef}
            class="size-16 h-full w-full -scale-x-100"
            autoplay
            playsinline
          />
        </div>
        <div class="flex gap-4 border-b p-5">
          <Badge size="md">오늘</Badge>
          <Badge size="md">오늘</Badge>
          <Badge size="md">오늘</Badge>
        </div>
      </div>
    </MenuLayout>
  );
};
