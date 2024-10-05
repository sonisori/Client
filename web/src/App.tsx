import { Router } from "@solidjs/router";

import { SignIn } from "./screen/SignIn";
import { Splash } from "./screen/Splash";
import { ViewportLayout } from "./ui/layout/ViewportLayout";

export const App = () => {
  return (
    <ViewportLayout>
      <Router>
        {[
          {
            path: "/sign-in",
            component: () => (
              <Splash>
                <SignIn />
              </Splash>
            ),
          },
        ]}
      </Router>
    </ViewportLayout>
  );
};
