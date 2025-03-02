import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", 
    port: 8080,
    proxy: {
      "/api/v1": {
        target: process.env.VITE_BACKEND_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist", // Ensure Vercel recognizes this directory
  },
});
