const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * Custom ESLint configuration for Next.js projects
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals", // Next.js recommended config
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
    "@typescript-eslint/no-explicit-any": "off", // Allow 'any'
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    "prettier/prettier": "error", // Enforce Prettier rules
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", ".next/", "out/", "dist/"],
};
