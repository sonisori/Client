import { useNavigate } from "@solidjs/router";

import { SignDetector } from "../component/domain/SignDetector";
export const Dictionary = () => {
  const navigate = useNavigate();
  const word = {
    word: "사과",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  };

  return (
    <div class="fixed inset-y-0 left-72 right-0">
      <SignDetector onDone={() => navigate(-1)} open signPhraseType="평서문" />
      <div
        class="absolute inset-0 flex flex-col"
        style={{ top: "calc(50vh + 70px)" }}
      >
        <div class="grid flex-1 grid-cols-2 gap-7 p-7">
          <div class="flex flex-col">
            <p class="mb-5 text-xl font-medium text-gray-900">{word.word}</p>
            {/* video placeholder */}
            <div class="flex-1 bg-gray-100" />
          </div>
          <div>
            <p class="mb-3 font-medium text-gray-900">수형 사진</p>
            <div class="flex gap-3">
              <div class="h-32 w-32 bg-gray-100" />
              <div class="h-32 w-32 bg-gray-100" />
            </div>
            <p class="mb-3 mt-5 font-medium text-gray-900">수형 설명</p>
            <p class="text-gray-800">
              오른 손바닥으로 주먹을 쥔 왼 팔을 쓸어내린 다음, 두 주먹을 쥐고
              바닥이 아래로 향하게하여 가슴 앞에서 아래로 내린다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
