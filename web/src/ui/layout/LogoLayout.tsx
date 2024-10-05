import { JSXElement } from "solid-js";

import { SERVICE_NAME } from "../../service/constant/domain";

export const LogoLayout = (props: { children: JSXElement }) => {
  return (
    <div>
      <div class="fixed inset-0 right-1/2 flex items-center justify-start pl-20">
        <h1 class="text-5xl font-semibold">{SERVICE_NAME}</h1>
      </div>
      <div class="absolute inset-0 left-1/2">{props.children}</div>
    </div>
  );
};
