/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXPRESS_BASE_URL: string
  readonly VITE_EXPRESS_PORT: string
  readonly VITE_API_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
