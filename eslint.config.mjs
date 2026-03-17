import globals from "globals";
import eslintPluginJs from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
// import prettierConfig from 'eslint-config-prettier';

export default [
  // Base configuration for JavaScript
  eslintPluginJs.configs.recommended,

  // TypeScript configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules, // Include recommended rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // 'prettier/prettier': 'error', // Prettier integration
    },
  },

  // Prettier configuration for all file types
  // {
  //   files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  //   rules: {
  //     ...prettierConfig.rules, // Disable rules conflicting with Prettier
  //   },
  // },
];
