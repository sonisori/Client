import { JSXElement, Match, Switch } from "solid-js";

import { SERVICE_NAME } from "../../service/constant/domain";
import { useAuth } from "../../service/hook/useAuth";
import { Button } from "../component/base/Button";
import { HandRaised } from "../icon/HandRaised";
import { School } from "../icon/School";
import { Setting } from "../icon/Setting";

const MenuLink = (props: {
  description: string;
  href: string;
  icon: JSXElement;
  title: string;
}) => {
  return (
    <Button
      as="a"
      class="block h-auto w-full text-start"
      href={props.href}
      variant="ghost"
    >
      <div class="flex items-start">
        <span class="mr-2 translate-y-2 scale-125">{props.icon}</span>
        <div class="text-start">
          <p class="text-base">{props.title}</p>
          <p class="text-sm font-normal text-muted-foreground">
            {props.description}
          </p>
        </div>
      </div>
    </Button>
  );
};

export const MenuLayout = (props: { children: JSXElement }) => {
  const { auth, freeAuth } = useAuth();
  const user = () => auth()?.user;
  return (
    <div>
      <div class="fixed inset-0 right-auto flex w-72 flex-col border-r">
        <div class="p-5 pl-8">
          <p class="text-sm text-gray-500">{user()?.name ?? "게스트"}님</p>
          <p class="text-base font-medium">{SERVICE_NAME}</p>
        </div>
        <div class="ml-8 mr-5 border-t" />
        <div class="space-y-2 p-5">
          <MenuLink
            description="실시간으로 통역을 제공"
            href="/app/translator"
            icon={<HandRaised />}
            title="수어 번역기"
          />
          <MenuLink
            description="AI와 함께 배우는 수어"
            href="/app/dictionary"
            icon={<School />}
            title="수어 학습"
          />
          <MenuLink
            description="수어로 문장 만들어보기"
            href="/app/learning"
            icon={<School />}
            title="수어 퀴즈"
          />
        </div>
        <div class="ml-8 mr-5 border-t" />
        <div class="space-y-2 p-5">
          <MenuLink
            description="서비스 사용에 필요한 설정"
            href="/app/setting"
            icon={<Setting />}
            title="설정"
          />
        </div>
        <div class="flex flex-1 flex-col items-end justify-end p-5">
          <Switch>
            <Match when={user()}>
              <Button onClick={freeAuth} variant="link">
                로그아웃
              </Button>
            </Match>
            <Match when={!user()}>
              <div>
                <Button as="a" href="/web/sign-up" variant="link">
                  회원가입
                </Button>
                <Button
                  as="a"
                  class="opacity-90"
                  href="/web/sign-in"
                  variant="link"
                >
                  로그인
                </Button>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
      <div class="absolute inset-0 left-72">{props.children}</div>
    </div>
  );
};
