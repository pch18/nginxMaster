import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./main.less";
import "@arco-design/web-react/dist/css/arco.css";

// const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

// darkThemeMq.addListener((e) => {
//   if (e.matches) {
//     document.body.setAttribute("arco-theme", "dark");
//   } else {
//     document.body.removeAttribute("arco-theme");
//   }
// });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
