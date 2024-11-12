import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export const Redirect = (props: { to: string }) => {
  const navigate = useNavigate();

  onMount(() => navigate(props.to));

  return <></>;
};
