import { config as baseConfig } from '@pointflow/eslint-config/base'
import { defineConfig } from 'eslint/config'

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
])
