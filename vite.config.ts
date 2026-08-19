import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    tanstackStart: {
      server: { entry: "server" },
    },
    // Define env variables for the app
    define: {
      'process.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      'process.env.TURSO_AUTH_TOKEN': JSON.stringify(env.TURSO_AUTH_TOKEN),
    },
  };
});