import { useLocation, useNavigate } from "@solidjs/router";
import {
  createContext,
  createEffect,
  createSignal,
  JSXElement,
  on,
  useContext,
} from "solid-js";

import { Auth } from "../type/auth";
import { client } from "../util/api";

const REDIRECT = "redirect";

const useCreateAuth = () => {
  const [auth, setAuth] = createSignal<Auth | null>(null);

  const loadUser = async () => {
    const user = await client
      .get("api/users/me")
      .json<{ name: string; socialType: string }>();
    setAuth(() => ({ user }));
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

const AuthContext = createContext<ReturnType<typeof useCreateAuth>>(
  {} as ReturnType<typeof useCreateAuth>,
);

export const AuthProvider = (props: { children: JSXElement }) => {
  return (
    <AuthContext.Provider value={useCreateAuth()}>
      {props.children}
    </AuthContext.Provider>
  );
};

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
  const { auth, loadUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (options.goToApp) {
    createEffect(
      on(auth, (auth) => {
        if (auth) {
          navigate(location.query[REDIRECT] ?? "/app/translator", {
            replace: true,
          });
        }
      }),
    );
  }
  if (options.goToWeb) {
    createEffect(
      on(auth, (auth) => {
        if (!auth) {
          navigate(
            location.query[REDIRECT] ??
              `/web/sign-in?${REDIRECT}=${encodeURIComponent(location.pathname)}`,
            { replace: true },
          );
        }
      }),
    );
  }

  return { auth, loadUser, logout };
};
