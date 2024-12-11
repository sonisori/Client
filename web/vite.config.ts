import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [devtools({ autoname: true }), solid()],
  server: {
    proxy: {
      "^/bff/.*": {
        target: "https://api.sonisori.site",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        rewrite: (path) => path.replace(/^\/bff/, ""),
      },
      "^/ai-rest/.*": {
        target: "https://ai.sonisori.site",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-rest/, ""),
      },
    },
  },
});
