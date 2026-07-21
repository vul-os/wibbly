import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
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
]
