import { createSignal } from "solid-js";

import { Auth } from "../type/auth";
import { client } from "../util/api";

export const useAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const registerToken = (token: string) => {
    setAuth(() => ({
      token,
      user: { email: "", name: "" },
      client: client.extend({ headers: { Authorization: `Bearer ${token}` } }),
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
