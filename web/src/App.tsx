import { Router } from "@solidjs/router";

import { LogoLayout } from "./ui/layout/LogoLayout";
import { MenuLayout } from "./ui/layout/MenuLayout";
import { ViewportLayout } from "./ui/layout/ViewportLayout";
import { Dictionary } from "./ui/screen/Dictionary";
import { DictionaryList } from "./ui/screen/DictionaryList";
import { Learning } from "./ui/screen/Learning";
import { LearningList } from "./ui/screen/LearningList";
import { NotFound } from "./ui/screen/NotFound";
import { Redirect } from "./ui/screen/Redirect";
import { Setting } from "./ui/screen/Setting";
import { SignIn } from "./ui/screen/SignIn";
import { SignUp } from "./ui/screen/SignUp";
import { Splash } from "./ui/screen/Splash";
import { Translator } from "./ui/screen/Translator";

export const App = () => {
  return (
    <ViewportLayout>
      <Router>
        {[
          {
            component: (props) => <Splash children={props.children} />,
            children: [
              {
                path: "/",
                component: () => <Redirect to="/app/translator" />,
              },
              {
                path: "/web",
                component: (props) => <LogoLayout children={props.children} />,
                children: [
                  {
                    path: "/sign-in",
                    component: () => <SignIn />,
                  },
                  {
                    path: "/sign-up",
                    component: () => <SignUp />,
                  },
                ],
              },
              {
                path: "/app",
                component: (props) => <MenuLayout children={props.children} />,
                children: [
                  {
                    path: "/dictionary",
                    component: () => <DictionaryList />,
                  },
                  {
                    path: "/dictionary/:id",
                    component: () => <Dictionary />,
                  },
                  {
                    path: "/learning",
                    component: () => <LearningList />,
                  },
                  {
                    path: "/learning/:id",
                    component: () => <Learning />,
                  },
                  {
                    path: "/setting",
                    component: () => <Setting />,
                  },
                  {
                    path: "/translator",
                    component: () => <Translator />,
                  },
                ],
              },
              {
                path: "*",
                component: () => <NotFound />,
              },
            ],
          },
        ]}
      </Router>
    </ViewportLayout>
  );
};
