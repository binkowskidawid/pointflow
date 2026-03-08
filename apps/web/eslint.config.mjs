import { nextJsConfig } from "@pointflow/eslint-config/next-js"

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextJsConfig
]

export default eslintConfig
