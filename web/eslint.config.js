import pluginJs from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";
import solid from "eslint-plugin-solid/configs/typescript";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default [
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.app.json",
      },
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,
      "perfectionist/sort-objects": ["error", { destructureOnly: true }],
      "perfectionist/sort-jsx-props": "warn",
    },
  },
  {
    plugins: { react },
    rules: { "react/jsx-curly-brace-presence": ["warn", "never"] },
  },
];
