/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SONISORI_AI_REST_URL: string;
  readonly VITE_SONISORI_AI_SOCKET_URL: string;
  readonly VITE_SONISORI_BFF_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
