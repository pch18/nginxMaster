import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "../components/RouterLayout";
import Site from "./Site";
import Cert from "./Cert";
import Home from "./Home";
import NiceModal from "@ebay/nice-modal-react";
import { useCertList, useSiteList } from "@/common/useList";
import { HoxRoot } from "hox";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouterLayout
        menuItems={[
          // { path: "/", name: "概览" },
          { path: "/", name: "站点" },
          { path: "/cert", name: "证书" },
        ]}
      />
    ),
    children: [
      // {
      //   path: "/",
      //   element: <Home />,
      // },
      {
        path: "/",
        element: <Site />,
      },
      {
        path: "/cert",
        element: <Cert />,
      },
    ],
  },
]);

function App() {
  return (
    <HoxRoot>
      <NiceModal.Provider>
        <RouterProvider router={router} />
      </NiceModal.Provider>
    </HoxRoot>
  );
}

export default App;
