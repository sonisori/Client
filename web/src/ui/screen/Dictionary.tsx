import { useNavigate, useParams } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";

import { client } from "../../service/util/api";
import { ScrollArea } from "../component/base/ScrollAreaV2";
import { SignDetector } from "../component/domain/SignDetector";
export const Dictionary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data] = createResource(() =>
    client.get(`api/words/${id}`).json<{
      description: string;
      resources: {
        resourceType: "image" | "video";
        resourceUrl: string;
      }[];
      word: string;
    }>(),
  );

  return (
    <div class="fixed inset-y-0 left-72 right-0">
      <SignDetector onDone={() => navigate(-1)} open signPhraseType="평서문" />
      <Show when={data()}>
        {(data) => (
          <ScrollArea
            class="absolute inset-0 duration-500 animate-in fade-in slide-in-from-bottom-5"
            direction="vertical"
            style={{
              // sign-detector의 바닥에 붙도록
              top: "calc(50vh + 70px)",
            }}
          >
            <div class="grid flex-1 grid-cols-2 gap-7 p-7">
              <div class="flex flex-col">
                <p class="mb-5 text-xl font-medium text-gray-900">
                  {data().word}
                </p>
                {/* video placeholder */}
                <video
                  autoplay
                  class="aspect-video"
                  controls
                  loop
                  src={
                    data().resources.find(
                      (resource) => resource.resourceType === "video",
                    )?.resourceUrl
                  }
                />
                <div class="flex-1 bg-gray-100" />
              </div>
              <div>
                <p class="mb-3 font-medium text-gray-900">수형 사진</p>
                <div class="flex gap-3">
                  <For
                    each={data().resources.filter(
                      (resource) => resource.resourceType === "image",
                    )}
                  >
                    {(resource) => (
                      <img
                        alt=""
                        class="size-32 object-contain"
                        src={resource.resourceUrl}
                      />
                    )}
                  </For>
                </div>
                <p class="mb-3 mt-5 font-medium text-gray-900">수형 설명</p>
                <p class="text-gray-800">{data().description}</p>
              </div>
            </div>
          </ScrollArea>
        )}
      </Show>
    </div>
  );
};
