import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base:"/",
  server: { proxy: {
    "/api": { target: "http://localhost:5000", changeOrigin: true },
    "/uploads": { target: "http://localhost:5000", changeOrigin: true },
  } },
  resolve: {
    alias: {
      moment: "moment/moment.js",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
