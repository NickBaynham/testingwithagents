import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Stub MDX imports for unit tests. Vitest does not run the @next/mdx
      // webpack loader, so any *.mdx import resolves to a no-op component.
      // Tests that need a specific MDX body should override via vi.mock(...).
      { find: /^.*\.mdx$/, replacement: path.resolve(__dirname, "tests/unit/mdx-stub.tsx") },
      { find: "@", replacement: path.resolve(__dirname, ".") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "tests/a11y/**", "node_modules", ".next"],
  },
});
