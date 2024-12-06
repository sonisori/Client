import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [devtools({ autoname: true }), solid()],
  server: {
    proxy: {
      "^/api/.*": {
        target: "https://api.sonisori.site",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
      "^:5002/.*": {
        target: "ws://api.sonisori.site:5002",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
