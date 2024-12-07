import { useNavigate } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";

import { useAuth } from "../../service/hook/useAuth";
import { client } from "../../service/util/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../component/base/Table";

export const DictionaryList = () => {
  const navigate = useNavigate();
  useAuth({ goToWeb: true });
  const [data] = createResource(() =>
    client.get("api/words").json<{ id: number; word: string }[]>(),
  );

  return (
    <div class="fixed inset-y-0 left-72 right-0 overflow-y-scroll">
      <div class="px-20 py-12">
        <div class="pl-5">
          <h1 class="text-xl font-semibold">수어 학습</h1>
          <p class="text text-muted-foreground">AI와 함께 배우는 수어</p>
        </div>
        <div class="pl-5 pt-10">
          <div class="mb-10 rounded-lg bg-gray-50 p-5 duration-500 animate-in fade-in slide-in-from-bottom-5">
            <p class="mb-3 font-medium text-gray-900">
              수어•지문자•지숫자의 설명에 사용한 손가락의 번호
            </p>
            <div class="flex gap-5">
              <img alt="손가락 번호" src="/asset/hand-num.png" />
              <p class="break-keep text-gray-800">
                수어 / 지문자 / 지숫자의 설명에 손가락을 사용할 경우 손가락의
                이름을 사용하지 않고 손가락의 번호를 사용하였다. 사용한 손가락의
                번호는 다음과 같다.
              </p>
            </div>
          </div>
          <Show when={data()}>
            <Table class="w-full duration-500 animate-in fade-in slide-in-from-bottom-5">
              <TableCaption>사용 가능한 수어 모음입니다.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "64px" }}>Id</TableHead>
                  <TableHead>단어</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={data()}>
                  {(word) => (
                    <TableRow
                      class="cursor-pointer"
                      onClick={() => {
                        navigate(`/app/dictionary/${word.id}`);
                      }}
                    >
                      <TableCell>{word.id}</TableCell>
                      <TableCell>{word.word}</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </Show>
        </div>
      </div>
    </div>
  );
};
