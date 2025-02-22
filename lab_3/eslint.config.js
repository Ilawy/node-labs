import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Configures for antfu's config
    rules: {
      'no-console': 'off',
    },
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {
      'style/spaced-comment': 'off',
    },
  },
)
