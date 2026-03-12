import type { KnipConfig } from "knip";

const config: KnipConfig = {
  tags: ["-knipignore"],
  entry: ["src/**/*.d.ts"],
  playwright: {
    config: ["playwright.config.ts", "playwright.prod.config.ts"],
    entry: ["**/e2e/*.@(spec|test).?(c|m)[jt]s?(x)"],
  },
};

export default config;
