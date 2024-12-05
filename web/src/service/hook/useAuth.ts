import { createSignal } from "solid-js";

import { Auth } from "../type/auth";
import { client } from "../util/api";

export const useAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const registerToken = (token: string) => {
    setAuth(() => ({
      token,
      user: { email: "", name: "" },
    }));
  };

  const logout = async () => {
    await client.delete("api/auth/logout");
    setAuth(null);
  };

  return {
    auth,
    setAuth,
    registerToken,
    logout,
  };
};
