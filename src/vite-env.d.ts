/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYST_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
