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
          "babel-plugin-styled-components",
        ],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: "0.0.0.0", // 允许所有 IP 访问
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
        secure: false, // 忽略 SSL 证书验证
      },
    },
  },
  build: {
    sourcemap: true,
    minify: true,
  },
});
