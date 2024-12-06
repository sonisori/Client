import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

import { Auth } from "../type/auth";
import { client } from "../util/api";

const [auth, setAuth] = createSignal<Auth | null>(null);

export const useAuth = (
  /**
   * 페이지 단위 컴포넌트에서만 호출한다.
   */
  options: {
    /**
     * 로그인이 된 경우, 앱으로 이동합니다.
     */
    goToApp?: boolean;
    /**
     * 로그인이 안된 경우, 웹으로 이동합니다.
     */
    goToWeb?: boolean;
  } = {
    goToApp: false,
    goToWeb: false,
  },
) => {
  const navigate = useNavigate();

  const loadUser = async () => {
    const user = await client
      .get("api/users/me")
      .json<{ name: string; socialType: string }>();
    setAuth({ user });
  };

  const logout = async () => {
    await client.delete("api/auth/logout");
    setAuth(null);
  };

  if (options.goToApp) {
    createEffect(() => {
      if (auth()) {
        navigate("/app/translator");
      }
    });
  }
  if (options.goToWeb) {
    createEffect(() => {
      if (!auth()) {
        navigate("/web/sign-in");
      }
    });
  }

  return {
    auth,
    loadUser,
    logout,
  };
};
