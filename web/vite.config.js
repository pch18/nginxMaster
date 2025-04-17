import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Inspect(),
    react({
      babel: {
        plugins: [
          "babel-plugin-styled-windicss",
          // "babel-plugin-styled-components",
        ],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: "0.0.0.0", // 允许所有 IP 访问

    proxy: {
      "/api": {
        // target: "http://100.111.5.30:9999",
        target: "http://127.0.0.1:7777",
        changeOrigin: true,
        secure: false, // 忽略 SSL 证书验证
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
          proxy.on("proxyReq", (proxyReq, req, res) => {
            res.on("close", () => {
              if (!res.finished) proxyReq.destroy();
            });
          });
        },
      },
    },
  },
  build: {
    sourcemap: true,
    minify: true,
  },
});
