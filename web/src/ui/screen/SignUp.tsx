import { HTTPError } from "ky";
import { createSignal, Show } from "solid-js";

import { useAsync } from "../../service/hook/useAsync";
import { client } from "../../service/util/api";
import { cn } from "../../service/util/cn";
import { Alert, AlertDescription, AlertTitle } from "../component/base/Alert";
import { Button } from "../component/base/Button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "../component/base/TextField";

const LoginError = (props: { message: string }) => (
  <Alert class="mb-6" variant="destructive">
    <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 9v4m-1.637-9.409L2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0zM12 16h.01"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>
    <AlertTitle>다시 시도해주세요.</AlertTitle>
    <AlertDescription>{props.message}</AlertDescription>
  </Alert>
);

export const SignUp = () => {
  let passwordField!: HTMLInputElement;
  let loginForm!: HTMLFormElement;

  const { loading, wrap } = useAsync();

  const [showPassword, setShowPassword] = createSignal(false);
  const [error, setError] = createSignal<null | string>(null);

  return (
    <div class="p-20 pt-32">
      <p class="text-2xl font-medium">계정 만들기</p>
      <form
        class="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!showPassword()) {
            setShowPassword(true);
            passwordField.focus();
            return;
          }
          const form = new FormData(loginForm);
          wrap(() =>
            client
              .post("api/auth/signup", { json: Object.fromEntries(form) })
              .json()
              .then(console.log)
              .catch((error: HTTPError) => {
                switch (error.response.status) {
                  case 409:
                    setError("이미 존재하는 이메일입니다.");
                    return;
                  default:
                    setError("올바르지 않은 입력입니다.");
                    return;
                }
              }),
          );
        }}
        ref={loginForm}
      >
        <Show when={error()}>
          {(error) => <LoginError message={error()} />}
        </Show>
        <TextFieldRoot name="email">
          <TextFieldLabel>이메일</TextFieldLabel>
          <TextField autofocus />
        </TextFieldRoot>
        <TextFieldRoot
          class={cn("mt-5", !showPassword() && "hidden")}
          name="name"
        >
          <TextFieldLabel>이름</TextFieldLabel>
          <TextField ref={passwordField} />
        </TextFieldRoot>
        <TextFieldRoot
          class={cn("mt-5", !showPassword() && "hidden")}
          name="password"
        >
          <TextFieldLabel>비밀번호</TextFieldLabel>
          <TextField type="password" />
        </TextFieldRoot>
        <Button class="mt-8 block w-full" disabled={loading()} type="submit">
          <Show fallback="계속" when={showPassword()}>
            회원가입
          </Show>
        </Button>
      </form>
      <div class="mt-3 text-center text-sm text-secondary-foreground">
        이미 계정이 있으신가요?{" "}
        <Button as="a" href="/web/sign-in" size="sm" variant="link">
          로그인
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
