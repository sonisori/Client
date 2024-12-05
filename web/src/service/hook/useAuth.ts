import { createSignal } from "solid-js";

import { Auth } from "../type/auth";

export const useAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const registerToken = (token: string) => {
    setAuth(() => ({
      token,
      user: { email: "", name: "" },
    }));
  };

  const freeAuth = () => {
    setAuth(null);
  };

  return {
    auth,
    setAuth,
    registerToken,
    freeAuth,
  };
};
