// vite.config.ts
import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  tanstackStart: {
    server: { entry: 'server' },
  },
  // Make sure environment variables are loaded
  server: {
    port: 8080,
  },
  // This ensures environment variables are available
  define: {
    'import.meta.env.VITE_TURSO_URL': JSON.stringify(process.env.VITE_TURSO_URL),
    'import.meta.env.VITE_TURSO_AUTH_TOKEN': JSON.stringify(process.env.VITE_TURSO_AUTH_TOKEN),
  },
});