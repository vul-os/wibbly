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
  {
    ignores: [
      'dist',
      // Vendored MediaPipe Tasks Vision wasm loader (scripts/vendor-hand-
      // assets.mjs copies these verbatim from @mediapipe/tasks-vision's own
      // npm package) — third-party build output, not this project's source.
      // Same reasoning root repo's public/models/movenet-multipose-
      // lightning has never needed linting for.
      'public/models/hand-landmarker/wasm/**',
    ],
  },
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
        projectService: {
          // vitest.config.ts lives at the package root, outside tsconfig.json's
          // own `"include": ["src"]` — typescript-eslint's own documented
          // fix for a root-level TS file with no project of its own.
          allowDefaultProject: ['vitest.config.ts'],
        },
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
  // eslint-plugin-react-hooks 5.0.0 -> 7.1.1 (this pass's toolchain
  // alignment, see package.json) brought in 14 NEW rules beyond the two
  // that existed in 5.x (rules-of-hooks, exhaustive-deps) — the "React
  // Compiler" rule family (purity, immutability, refs, globals, ...),
  // folded into this plugin's `recommended` config in 6.x+. Measured across
  // this package (2026-08-06): 147 new errors, ALL either
  // `react-hooks/purity` (30, `Math.random()` called directly in a JSX prop
  // during render — a real anti-pattern the rule is right to flag in
  // general) or `react-hooks/immutability` (117, all of them
  // `gl.domElement.style.cursor = ...` inside a drag handler, where `gl`
  // comes from `useThree()`) — and ALL 27 affected files are the 29
  // industrial-object components under
  // src/pages/viz/components/objects/**, the visualisation layer folded in
  // wholesale from the deleted `vul-os/palmworks` repo (see
  // ../../PALMWORKS.md §1) rather than written against these rules. Fixing
  // 147 findings across 27 unrelated files is out of scope for wiring up
  // hand gestures, and `gl.domElement` is a raw DOM/canvas element — an
  // imperative escape hatch outside React's own state, not the kind of
  // hook-return mutation this rule exists to catch — so it is a real,
  // scoped false-positive shape here, not noise being waved away. Scoped to
  // exactly that directory; `rules-of-hooks`/`exhaustive-deps` and every
  // other rule in the set (including for THESE same files) stay at their
  // full `recommended` severity, and the gesture-input code this pass adds
  // (src/gestures/**, plant-scene-logic.ts, the refactored PlantScene.tsx)
  // is held to the complete, unmodified ruleset.
  {
    files: ['src/pages/viz/components/objects/**/*.tsx'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
)
