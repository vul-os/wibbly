import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// This config covers the npm-workspace root: root src/ (the app shell),
// games/tennis (which relocated out of src/game but stays part of this same
// project — it has no independent entry point or build of its own, it is a
// component the app shell renders), and packages/* (the
// @vulos/wibbly-{input,p2p,authority} libraries), which share this install's
// node_modules via workspace hoisting.
//
// games/palmworks is a SEPARATE npm project (its own package.json,
// package-lock.json and node_modules) and lints itself via
// games/palmworks/eslint.config.js. site/ stays plain JS and out of scope
// per repo policy. Both are excluded below rather than merged into one
// config, since ESLint plugin resolution follows node_modules and mixing
// two independent installs into a single flat config would be fragile.
export default defineConfig([
  globalIgnores(['dist', 'dist-demo', 'games/palmworks', 'site', 'packages/*/dist']),
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
  // src/, games/tennis, test/, and packages/*/{src,test} are TS/TSX end to
  // end — parse with the typescript-eslint parser and lint with the
  // type-aware recommended TS rule set. projectService resolves each file
  // against the nearest tsconfig.json (this project's root tsconfig.json for
  // src/games/tennis/test, each package's own tsconfig.json for
  // packages/*/{src,test}) so no-floating-promises, no-misused-promises and
  // the no-unsafe-* family actually run against real type information
  // instead of being silently untyped `recommended`.
  //
  // Level: recommendedTypeChecked, not strictTypeChecked — measured
  // 2026-08-05, see triage notes. strictTypeChecked added findings almost
  // entirely from no-confusing-void-expression/no-non-null-assertion
  // fighting deliberate idioms here, matching the fleet-wide pattern.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Of the 8 no-misused-promises findings surfaced when type-aware
      // linting was turned on, 7 were "Promise-returning function provided
      // to attribute" — every one of them either `onClick={() =>
      // navigate(...)}` (react-router's NavigateFunction is typed `void |
      // Promise<void>`; react-router's own docs use this exact
      // fire-and-forget shape, and there is no meaningful rejection a
      // client-side navigation call produces here to catch) or
      // `onClick={startCamera}` in setup.tsx, an async function whose own
      // try/catch (see startCamera's comment) now covers its entire body
      // and already turns every failure into visible `camera` state — none
      // was a genuine unhandled-rejection risk. `checksVoidReturn.attributes:
      // false` is typescript-eslint's own documented option for exactly
      // this JSX-handler false-positive; the rule's other checks (bare
      // conditionals, arguments, IIFE callbacks) stay fully active. The 8th
      // finding, frame-source.ts:419 ("Expected non-Promise value in a
      // boolean conditional"), is a different shape and is fixed at the
      // source instead — see that file.
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
    },
  },
])
