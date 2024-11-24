import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./main.less";
import "@arco-design/web-react/dist/css/arco.css";

// import * as echarts from "echarts/core";
// import {
//   GridComponent,
//   TooltipComponent,
//   AxisPointerComponent,
//   TitleComponent,
//   DatasetComponent,
//   MarkPointComponent,
//   MarkLineComponent,
// } from "echarts/components";

// echarts 初始化
// echarts.use([
// Components
// TitleComponent,
// TooltipComponent,
// AxisPointerComponent,
// DatasetComponent,
// GridComponent,
// MarkPointComponent,
// MarkLineComponent,
// // Transitions
// UniversalTransition,
// // Charts
// PieChart,
// LineChart,
// // Renderer
// SVGRenderer,
// ]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
