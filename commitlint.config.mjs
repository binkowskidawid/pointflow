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
        'notification',
        'analytics',
        // packages
        'contracts',
        'eslint-config',
        'typescript-config',
        'drizzle-schemas',
        'types',
        'notification-service',
        // infra & tooling
        'infrastructure',
        'ci',
        'quality-tools',
        'deps',
        // docs
        'docs',
      ],
    ],
    'scope-empty': [1, 'never'],
    'body-max-line-length': [0, 'always', Infinity],
  },
}
