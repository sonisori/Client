import { JSX, JSXElement } from "solid-js";

export const Button = (props: {
  children: JSXElement;
  style?: JSX.CSSProperties;
}) => {
  return (
    <button
      style={props.style}
      class="rounded-lg bg-black/90 px-3 py-1 text-white duration-75 active:opacity-60"
    >
      {props.children}
    </button>
  );
};
