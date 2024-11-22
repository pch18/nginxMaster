import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "../components/RouterLayout";
import Site from "./Site";
import Cert from "./Cert";
import NiceModal from "@ebay/nice-modal-react";
import { HoxRoot } from "hox";
import Login from "./Login";
import { useDarkMode } from "@/common/useDarkMode";
import { useLayoutEffect } from "react";
import Dash from "./Dash";

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
          { path: "/", name: "站点" },
          { path: "/cert", name: "证书" },
          { path: "/dash", name: "日志" },
        ]}
      />
    ),
    children: [
      {
        path: "/",
        element: <Site />,
      },
      {
        path: "/dash",
        element: <Dash />,
      },
      {
        path: "/cert",
        element: <Cert />,
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
