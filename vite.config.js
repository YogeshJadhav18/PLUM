import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // ensures all assets load properly on Render
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  }
});
