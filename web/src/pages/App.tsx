import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "../components/RouterLayout";
import NiceModal from "@ebay/nice-modal-react";
import { HoxRoot } from "hox";
import Login from "./Login";
import { useDarkMode } from "@/common/useDarkMode";
import { useLayoutEffect } from "react";
import {
  IconCompass,
  IconDashboard,
  IconLock,
} from "@arco-design/web-react/icon";
import SearchById from "./SearchById";
import Alarm from "./Alarm";
import SearchByConds from "./SearchByConds";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RouterLayout
        menuItems={[
          {
            path: "/",
            name: "ID 查询",
            icon: <IconCompass className="!mr-2" />,
          },
          {
            path: "/search",
            name: "LOG 搜索",
            icon: <IconLock className="!mr-2" />,
          },
          {
            path: "/alarm",
            name: "规则报警",
            icon: <IconDashboard className="!mr-2" />,
          },
        ]}
      />
    ),
    children: [
      {
        path: "/",
        element: <SearchById />,
      },
      {
        path: "/search",
        element: <SearchByConds />,
      },
      {
        path: "/alarm",
        element: <Alarm />,
      },
    ],
  },
]);

const Router = () => {
  const [isDark] = useDarkMode();
  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", isDark ? "dark" : "");
  }, [isDark]);

  return <RouterProvider router={router} />;
};

export default function App() {
  return (
    <HoxRoot>
      <NiceModal.Provider>
        <Router />
      </NiceModal.Provider>
    </HoxRoot>
  );
}
