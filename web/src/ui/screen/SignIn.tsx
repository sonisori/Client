import { createSignal, Show } from "solid-js";

import { useAsync } from "../../service/hook/useAsync";
import { useAuth } from "../../service/hook/useAuth";
import { client } from "../../service/util/api";
import { cn } from "../../service/util/cn";
import { Alert, AlertDescription, AlertTitle } from "../component/base/Alert";
import { Button } from "../component/base/Button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "../component/base/TextField";

const LoginError = () => (
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
    <AlertDescription>
      올바르지 않은 이메일 또는 비밀번호입니다.
    </AlertDescription>
  </Alert>
);

export const SignIn = () => {
  let passwordField!: HTMLInputElement;

  const { loadUser } = useAuth({ goToApp: true });
  const { loading, wrap } = useAsync();

  const [showPassword, setShowPassword] = createSignal(false);
  const [error, setError] = createSignal(false);

  return (
    <div class="p-20 pt-32">
      <p class="text-2xl font-medium">환영합니다</p>
      <form
        class="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!showPassword()) {
            setShowPassword(true);
            passwordField.focus();
            return;
          }
          const form = new FormData(e.currentTarget);
          wrap(() =>
            client
              .post("api/auth/login", { json: Object.fromEntries(form) })
              .json()
              .then(() => loadUser())
              .catch(() => void setError(true)),
          );
        }}
      >
        <Show when={error()}>
          <LoginError />
        </Show>
        <TextFieldRoot name="email">
          <TextFieldLabel>이메일</TextFieldLabel>
          <TextField autofocus />
        </TextFieldRoot>
        <TextFieldRoot
          class={cn("mt-5", !showPassword() && "hidden")}
          name="password"
        >
          <TextFieldLabel>비밀번호</TextFieldLabel>
          <TextField ref={passwordField} type="password" />
        </TextFieldRoot>
        <Button class="mt-8 block w-full" disabled={loading()} type="submit">
          <Show fallback="계속" when={showPassword()}>
            로그인
          </Show>
        </Button>
      </form>
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
          href={`${import.meta.env.VITE_SONISORI_BFF_API_URL}/oauth2/authorization/naver`}
          style={{ "background-color": "#1EC800", color: "#fff" }}
          variant="secondary"
        >
          Naver
        </Button>
        <Button
          as="a"
          class="block w-full"
          href={`${import.meta.env.VITE_SONISORI_BFF_API_URL}/oauth2/authorization/kakao`}
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
