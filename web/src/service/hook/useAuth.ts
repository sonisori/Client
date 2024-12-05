import { createSignal } from "solid-js";

import { Auth } from "../type/auth";

export const useAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const logout = () => {
    setAuth(null);
  };

  return {
    auth,
    setAuth,
    logout,
  };
};
