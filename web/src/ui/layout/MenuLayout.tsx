import { JSXElement } from "solid-js";

import { SERVICE_NAME } from "../../service/constant/domain";
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
  const user = {
    name: "이동현",
  };
  return (
    <div>
      <div class="fixed inset-0 right-auto w-72 border-r">
        <div class="p-5 pl-8">
          <p class="text-sm text-gray-500">{user.name}님</p>
          <p class="text-base font-medium">{SERVICE_NAME}</p>
        </div>
        <div class="ml-8 mr-5 border-t" />
        <div class="space-y-2 p-5">
          <MenuLink
            description="실시간으로 통역을 제공"
            href="/translator"
            icon={<HandRaised />}
            title="수어 번역기"
          />
          <MenuLink
            description="수어를 쉽고 빠르게 학습"
            href="/learning"
            icon={<School />}
            title="수어 학습"
          />
        </div>
        <div class="ml-8 mr-5 border-t" />
        <div class="space-y-2 p-5">
          <MenuLink
            description="서비스 사용에 필요한 설정"
            href="/setting"
            icon={<Setting />}
            title="설정"
          />
        </div>
      </div>
      <div class="absolute inset-0 left-72">{props.children}</div>
    </div>
  );
};
