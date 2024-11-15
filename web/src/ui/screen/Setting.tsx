import { Button } from "../component/base/Button";
import {
  TextField,
  TextFieldDescription,
  TextFieldLabel,
  TextFieldRoot,
} from "../component/base/TextField";

export const Setting = () => {
  return (
    <div class="fixed inset-y-0 left-72 right-0 overflow-y-scroll">
      <div class="px-20 py-12">
        <div class="pl-5">
          <h1 class="text-xl font-semibold">설정</h1>
          <p class="text text-muted-foreground">서비스사용에 필요한 설정</p>
        </div>
        <div class="space-y-8 p-5 pt-10">
          <TextFieldRoot class="max-w-xs">
            <TextFieldLabel>이름</TextFieldLabel>
            <TextField />
            <TextFieldDescription>이름을 입력해주세요</TextFieldDescription>
          </TextFieldRoot>
          <TextFieldRoot class="max-w-xs">
            <TextFieldLabel>소셜</TextFieldLabel>
            <TextField disabled value="KAKAO" />
          </TextFieldRoot>
          <Button>저장</Button>
        </div>
      </div>
    </div>
  );
};
