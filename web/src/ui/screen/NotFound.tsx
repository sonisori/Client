import { SERVICE_NAME } from "../../service/constant/domain";
import { Button } from "../component/base/Button";

export const NotFound = () => {
  return (
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <h1 class="pt-3 font-mono text-5xl font-medium">404</h1>
      <p class="pb-7 pt-3 text-lg text-muted-foreground">
        찾을 수 없는 페이지입니다.
      </p>
      <Button as="a" href="/" variant="secondary">
        {SERVICE_NAME} 홈으로
      </Button>
    </div>
  );
};
