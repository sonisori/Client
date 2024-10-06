import { Router } from "@solidjs/router";

import { ViewportLayout } from "./ui/layout/ViewportLayout";
import { SignIn } from "./ui/screen/SignIn";
import { SignUp } from "./ui/screen/SignUp";
import { Splash } from "./ui/screen/Splash";

export const App = () => {
  return (
    <ViewportLayout>
      <Splash>
        <Router>
          {[
            {
              path: "/sign-in",
              component: () => <SignIn />,
            },
            {
              path: "/sign-up",
              component: () => <SignUp />,
            },
          ]}
        </Router>
      </Splash>
    </ViewportLayout>
  );
};
