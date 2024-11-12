import { createSignal } from "solid-js";

import { SignDetector } from "../component/domain/SignDetector";
import { MenuLayout } from "../layout/MenuLayout";

const quizes = [
  {
    type: "감탄문",
    words: ["나는", "오늘", "좋다"],
  },
  {
    type: "평서문",
    words: ["나는", "오늘", "아니다", "좋다"],
  },
] as const;

export const Learning = () => {
  const [quiz, setQuiz] = createSignal({ index: 1 });

  return (
    <MenuLayout>
      <div class="fixed inset-y-0 left-72 right-0">
        <SignDetector
          key={quiz().index}
          open
          signPhraseType={quizes[quiz().index - 1].type}
        />
        <div class="absolute inset-0" style={{ top: "calc(50vh + 70px)" }}>
          <button onClick={() => setQuiz((p) => ({ index: p.index + 1 }))}>
            ㅇㄹㅇㄹ {quiz().index}
          </button>
        </div>
      </div>
    </MenuLayout>
  );
};
