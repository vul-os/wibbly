import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url))

// palmworks is a SEPARATE npm project from the workspace root one level up
// (its own package.json, package-lock.json and node_modules) — see the doc
// comment in ../../eslint.config.js for why the two are not merged into one
// config. This file lints palmworks' own 45 sources, all but 3 of which are
// .tsx (see src/).
export default tseslint.config(
  { ignores: ['dist'] },
  // Shared across both JS and TS: the app's own plugin rules don't care
  // which language a file is written in.
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // This scene is built with @react-three/fiber: <mesh>, <group>,
      // <boxGeometry> etc. are r3f-managed Three.js objects, not DOM
      // elements. Their props (args, castShadow, metalness, ...) are not
      // real DOM/SVG attributes, so this rule is 100% false positives here.
      'react/no-unknown-property': 'off',
      // No component in this codebase uses the prop-types package (it
      // isn't even a dependency) — every prop on every component would
      // otherwise be flagged, which drowns out real lint signal.
      'react/prop-types': 'off',
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
)
