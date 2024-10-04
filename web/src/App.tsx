import { Router } from "@solidjs/router";

import { Splash } from "./screen/Splash";

export const App = () => {
  return (
    <Router>
      {[
        {
          path: "/",
          component: () => <Splash>내용 추가</Splash>,
        },
      ]}
    </Router>
  );
};
