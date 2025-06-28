/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
  readonly VITE_UNSPLASH_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
