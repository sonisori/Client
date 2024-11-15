import { Button } from "../component/base/Button";

export const SignIn = () => {
  return (
    <div class="p-20">
      <p class="text-2xl font-medium">소셜 로그인으로 시작하세요</p>
      <div class="mt-10 flex gap-4">
        <Button as="a" href="/sign-up">
          NAVER
        </Button>
        <Button>Kakao</Button>
      </div>
    </div>
  );
};
