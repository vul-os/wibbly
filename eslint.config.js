import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// This config covers the npm-workspace root: root src/ (the app shell) and
// packages/* (the @vulos/wibbly-{input,p2p,authority} libraries), which
// share this install's node_modules via workspace hoisting.
//
// games/palmworks is a SEPARATE npm project (its own package.json,
// package-lock.json and node_modules) and lints itself via
// games/palmworks/eslint.config.js. site/ stays plain JS and out of scope
// per repo policy. Both are excluded below rather than merged into one
// config, since ESLint plugin resolution follows node_modules and mixing
// two independent installs into a single flat config would be fragile.
export default defineConfig([
  globalIgnores(['dist', 'dist-demo', 'games', 'site', 'packages/*/dist']),
  // Shared across both JS and TS: the app's own plugin rules don't care
  // which language a file is written in.
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Anything still plain JS/JSX (vite.config.js, vitest.config.js) keeps
  // the original eslint-recommended + react-hooks setup.
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // src/ and packages/*/src are TS/TSX end to end — parse with the
  // typescript-eslint parser and lint with the recommended TS rule set.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
