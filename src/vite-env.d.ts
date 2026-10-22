/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_CLIENT_ID: string;
  readonly VITE_VK_ID_CLIENT_ID: string;
  readonly VITE_OAUTH_REDIRECT_URI: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
