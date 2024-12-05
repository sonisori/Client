import { Button } from "../component/base/Button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "../component/base/TextField";

export const SignIn = () => {
  return (
    <div class="p-20 pt-48">
      <p class="text-2xl font-medium">환영합니다</p>
      <div class="mt-10">
        <TextFieldRoot class="">
          <TextFieldLabel>이메일</TextFieldLabel>
          <TextField />
        </TextFieldRoot>
        <Button class="mt-5 block w-full">계속</Button>
      </div>
      <div class="mt-3 text-center text-sm text-secondary-foreground">
        처음이신가요?{" "}
        <Button as="a" href="/web/sign-up" size="sm" variant="link">
          회원가입
        </Button>
      </div>
      <div class="mb-12 mt-10 border-b" />
      <div class="space-y-5">
        <Button
          as="a"
          class="block w-full"
          href={`${import.meta.env.VITE_SONISORI_API_URL}/oauth2/authorization/naver`}
          style={{ "background-color": "#1EC800", color: "#fff" }}
          variant="secondary"
        >
          Naver
        </Button>
        <Button
          as="a"
          class="block w-full"
          href={`${import.meta.env.VITE_SONISORI_API_URL}/oauth2/authorization/kakao`}
          style={{ "background-color": "#FFEB00", color: "#000" }}
          variant="secondary"
        >
          Kakao
        </Button>
      </div>
      <div class="my-10 border-b" />

      <Button
        as="a"
        class="block w-full"
        href="/app/translator"
        variant="secondary"
      >
        비회원으로 시작하기
      </Button>
    </div>
  );
};
