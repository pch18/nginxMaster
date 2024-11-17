import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "../components/RouterLayout";
import SiteList from "./Site";
import Home from "./Home";
import NiceModal from "@ebay/nice-modal-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouterLayout
        menuItems={[
          // { path: "/", name: "概览" },
          { path: "/", name: "站点" },
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
        element: <SiteList />,
      },
    ],
  },
]);

function App() {
  return (
    <NiceModal.Provider>
      <RouterProvider router={router} />
    </NiceModal.Provider>
  );
}

export default App;
