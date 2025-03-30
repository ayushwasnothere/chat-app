const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * This is a custom ESLint configuration for libraries using TypeScript.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // Allow any
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": "error", // Ensure Prettier formatting
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"],
};
