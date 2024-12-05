import { createSignal } from "solid-js";

import { Auth } from "../type/auth";
import { client } from "../util/api";

export const useAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const loadUser = async () => {
    setAuth({
      user: await client
        .get("api/users/me")
        .json<{ name: string; socialType: string }>(),
    });
  };

  const logout = async () => {
    await client.delete("api/auth/logout");
    setAuth(null);
  };

  return {
    auth,
    loadUser,
    logout,
  };
};
