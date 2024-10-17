import { JSXElement } from "solid-js";

export type PropsOf<T> = T extends (props: infer P) => JSXElement ? P : never;
