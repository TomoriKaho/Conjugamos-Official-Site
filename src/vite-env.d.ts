/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string;
  readonly VITE_APK_DOWNLOAD_URL: string;
  readonly VITE_ADMIN_URL: string;
  readonly VITE_BACKEND_PING_URL: string;
  readonly VITE_REQUEST_TIMEOUT_MS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
