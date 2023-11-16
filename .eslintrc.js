module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['react-app', 'plugin:prettier/recommended', 'eslint:recommended'],
  rules: {
    'no-console': 'error',
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
