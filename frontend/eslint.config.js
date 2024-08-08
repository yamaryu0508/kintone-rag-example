import { fixupConfigRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import pluginImport from 'eslint-plugin-import';
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    plugins: {
      import: pluginImport
    },
    rules: {
      "react/no-unknown-property": ["error", {"ignore": ["css"]}],
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "object",
            "type",
            "index"
          ],
          "newlines-between": "always",
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": { "order": "asc", "caseInsensitive": true },
          "pathGroups": [
            {
              "pattern": "react**",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "{@/app/**,@/features/**,@/libs/**}",
              "group": "internal",
              "position": "before"
            },
            {
              "pattern": "{@/components/**,@/pages/**}",
              "group": "internal",
              "position": "before"
            },
            {
              "pattern": "./**.module.css",
              "group": "index",
              "position": "after"
            }
          ]
        }
      ]
    }
  }
];