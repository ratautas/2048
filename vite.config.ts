import path from "path";
import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce((prev, [key, val]) => {
    return {
      ...prev,
      ["process.env." + key]: `"${val}"`,
    };
  }, {});

  return {
    plugins: [reactRefresh()],
    esbuild: {
      jsxInject: `import React from 'react'`, // automatically import React in jsx files
    },
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`,
      },
    },
    define: envWithProcessPrefix,
  };
});
