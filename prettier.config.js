/**
 *  @type {import("prettier").Options}
 */
const config = {
  plugins: [
    "prettier-plugin-css-order",
    "prettier-plugin-svelte",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  cssDeclarationSorterOrder: "smacss",
  importOrder: [
    "^svelte$",
    "<TYPES>^(svelte)",
    "^clsx$",
    "<TYPES>^(clsx)",
    "^@*svelte",
    "<TYPES>^(@*svelte)",
    "<BUILTIN_MODULES>",
    "<TYPES>^(node:)",
    "<THIRD_PARTY_MODULES>",
    "<TYPES>^([@a-z])",
    "^~/(.*)$",
    "<TYPES>^~/(.*)",
    "^[.]",
    "<TYPES>",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  // renovate: datasource=npm depName=typescript
  importOrderTypeScriptVersion: "5.8.3",
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],
  tailwindFunctions: ["clsx", "cn", "cva", "cx", "tv"],
};

export default config;
