import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url))

// palmworks is a SEPARATE npm project from the workspace root one level up
// (its own package.json, package-lock.json and node_modules) — see the doc
// comment in ../../eslint.config.js for why the two are not merged into one
// config. This file lints palmworks' own sources.
//
// `eslint-plugin-react` (recommended + jsx-runtime rulesets) USED to be part
// of this config. It was dropped when this package's ESLint was aligned to
// the workspace root's ^10.8.0 (2026-08-06): the plugin's own
// `peerDependencies` cap at `eslint: "... || ^9.7"` — no released version
// supports ESLint 10 — so keeping it would have meant staying on ESLint 9
// and forking this package's toolchain from root's, the opposite of the
// point of aligning it. Root's own config (../../eslint.config.js) never
// depended on eslint-plugin-react at all — react-hooks + react-refresh +
// typescript-eslint's type-aware rules are root's whole React lint surface
// — so dropping it here is adopting root's existing shape, not inventing a
// weaker one. The two rules this file used to turn OFF via the plugin
// (`react/no-unknown-property`, `react/prop-types`) do not exist without
// the plugin, so there is nothing left to suppress.
export default tseslint.config(
  { ignores: ['dist'] },
  // Shared across both JS and TS: the app's own plugin rules don't care
  // which language a file is written in.
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Anything still plain JS/JSX (vite.config.js, postcss.config.js,
  // tailwind.config.js) keeps the original eslint-recommended setup.
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },
  // src/ is TS/TSX end to end — parse with the typescript-eslint parser and
  // lint with the type-aware recommended TS rule set. projectService is
  // scoped to this package's own tsconfig.json (this is a separate npm
  // project from the workspace root one level up — see the file's top
  // comment), so no-floating-promises, no-misused-promises and the
  // no-unsafe-* family run against this package's own type information.
  //
  // Level: recommendedTypeChecked, not strictTypeChecked — measured
  // 2026-08-05, see triage notes; strictTypeChecked's extra findings were
  // dominated by no-confusing-void-expression/no-non-null-assertion
  // fighting deliberate idioms here, matching the fleet-wide pattern.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir,
      },
    },
    rules: {
      // The one no-misused-promises finding surfaced when type-aware linting
      // was turned on: not-found.tsx's onClick={() => navigate('/')}.
      // react-router's NavigateFunction is typed `void | Promise<void>` and
      // used fire-and-forget in react-router's own docs; there is no
      // meaningful rejection a client-side navigation call produces here.
      // Same reasoning and same option (typescript-eslint's own documented
      // fix for this exact JSX-handler false-positive) as the root
      // eslint.config.js one level up.
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
    },
  },
  {
    // Config files run under Node, not the browser.
    files: ['*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // tailwind.config.js is the one config file still on CommonJS
    // (module.exports / require), loaded by Tailwind's own resolver.
    files: ['tailwind.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  // require-await downgraded to `warn`, test files only — same measured
  // reasoning and same narrow scope as root eslint.config.js's identical
  // override: scripted test fakes (e.g. a fake HandTracker) implement an
  // interface whose real method IS async, so the fake returns a Promise to
  // satisfy the type even though its own fake body never awaits anything.
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      '@typescript-eslint/require-await': 'warn',
    },
  },
)
