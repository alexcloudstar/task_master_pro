//// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
