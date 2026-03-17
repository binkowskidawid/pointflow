export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // apps
        'web',
        'portal',
        // services
        'api-gateway',
        'loyalty-engine',
        'auth',
        'notifications',
        'analytics',
        // packages
        'contracts',
        'eslint-config',
        'typescript-config',
        'drizzle-schemas',
        'types',
        // infra & tooling
        'infrastructure',
        'ci',
        'quality-tools',
        'deps',
        // docs
        'docs',
        // other
        'tests',
      ],
    ],
    'scope-empty': [1, 'never'],
    'body-max-line-length': [0, 'always', Infinity],
  },
}
