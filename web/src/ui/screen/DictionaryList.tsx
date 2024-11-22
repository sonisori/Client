import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";

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
  const words = [
    {
      word: "안녕",
      id: 1,
    },
    {
      word: "배",
      id: 2,
    },
  ];
  return (
    <div class="fixed inset-y-0 left-72 right-0 overflow-y-scroll">
      <div class="px-20 py-12">
        <div class="pl-5">
          <h1 class="text-xl font-semibold">수어 학습</h1>
          <p class="text text-muted-foreground">AI와 함께 배우는 수어</p>
        </div>
        <div class="pl-5 pt-10">
          <Table class="w-full">
            <TableCaption>사용 가능한 수어 모음입니다.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "64px" }}>Id</TableHead>
                <TableHead>단어</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={words}>
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
        </div>
      </div>
    </div>
  );
};
