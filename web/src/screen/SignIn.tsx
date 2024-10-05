import { Button } from "../ui/component/Button";
import { LogoLayout } from "../ui/layout/LogoLayout";

export const SignIn = () => {
  return (
    <LogoLayout>
      <div class="px-5 py-20">
        <p class="text-2xl font-medium">소셜 로그인으로 시작하세요</p>
        <div class="mt-10 flex gap-4">
          <Button style={{ "background-color": "#03C75A" }}>NAVER</Button>
          <Button style={{ "background-color": "#FEE500", color: "#000" }}>
            Kakao
          </Button>
        </div>
      </div>
    </LogoLayout>
  );
};
