import { useAsync } from "../../service/hook/useAsync";
import { useAuth } from "../../service/hook/useAuth";
import { client } from "../../service/util/api";
import { Button } from "../component/base/Button";
import {
  TextField,
  TextFieldDescription,
  TextFieldLabel,
  TextFieldRoot,
} from "../component/base/TextField";

export const Setting = () => {
  const { auth, loadUser } = useAuth({ goToWeb: true });
  const { loading, wrap } = useAsync();
  return (
    <div class="fixed inset-y-0 left-72 right-0 overflow-y-scroll">
      <div class="px-20 py-12">
        <div class="pl-5">
          <h1 class="text-xl font-semibold">설정</h1>
          <p class="text text-muted-foreground">서비스사용에 필요한 설정</p>
        </div>
        <form
          class="space-y-8 p-5 pt-10"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            wrap(() =>
              client
                .put("api/users/me", { json: Object.fromEntries(form) })
                .json<void>()
                .then(() => loadUser()),
            );
          }}
        >
          <TextFieldRoot class="max-w-xs" name="name">
            <TextFieldLabel>이름</TextFieldLabel>
            <TextField value={auth()?.user.name} />
            <TextFieldDescription>이름을 입력해주세요</TextFieldDescription>
          </TextFieldRoot>
          <TextFieldRoot class="max-w-xs">
            <TextFieldLabel>소셜</TextFieldLabel>
            <TextField disabled value={auth()?.user.socialType} />
          </TextFieldRoot>
          <Button disabled={loading()} type="submit">
            저장
          </Button>
        </form>
      </div>
    </div>
  );
};
