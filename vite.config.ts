import { defineConfig } from "vite";

// base "./" keeps every asset path relative, so the same build works at a
// domain root or under a GitHub Pages project path like /castmaker/.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2022",
  },
});
