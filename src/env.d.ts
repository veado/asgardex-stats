/// <reference types="svelte" />
// Vite
// IntelliSense for TypeScript
// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
