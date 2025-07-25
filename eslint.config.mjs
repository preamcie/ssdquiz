// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import pluginSecurity from "eslint-plugin-security";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginSecurity.configs.recommended.rules,
    },
  },
];
