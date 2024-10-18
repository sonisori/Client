import { For, JSXElement } from "solid-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./base/Dropdown";

export const Dropdown = (props: {
  children: JSXElement;
  menu: {
    items: { disabled?: boolean; onClick: () => void; title: string }[];
    title?: string;
  }[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent class="w-36">
        <For each={props.menu}>
          {(menu) => (
            <DropdownMenuGroup>
              {typeof menu.title === "string" && (
                <>
                  <DropdownMenuGroupLabel>{menu.title}</DropdownMenuGroupLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <For each={menu.items}>
                {(item) => (
                  <DropdownMenuItem
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {item.title}
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuGroup>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
