module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'react-app',
    'react-app/jest',
    'google'
    // TODO: double-check
    // "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
    // "prettier"
  ],
  // TODO: double-check
  // "parser": "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'import'
    // TODO: double-check
    // "@typescript-eslint",
    // "prettier"
  ],
  rules: {
    // ESLinting rules
    'comma-dangle': ['error', 'never'],
    'no-console': 'off', // TODO: `off` for now but later should be `warn`
    indent: ['error', 2],
    'quote-props': ['error', 'as-needed'],
    'capitalized-comments': 'off',
    'max-len': [
      'warn',
      {
        code: 120
      } // 130 on GitHub, 80 on npmjs.org for README.md code blocks
    ],
    'arrow-parens': ['error', 'as-needed'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    'no-negated-condition': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        exceptions: ['/']
      }
    ],
    'no-dupe-keys': 'error',
    eqeqeq: 'error',
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
        maxBOF: 1
      }
    ],
    'space-infix-ops': [
      'error',
      {
        int32Hint: false
      }
    ],
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'space-in-parens': ['error', 'never'],

    // React ESLinting rules
    'react/prop-types': 'off',
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'always'
      }
    ],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never'
      }
    ],
    'react/jsx-curly-spacing': [
      'error',
      {
        when: 'never',
        children: true
      }
    ],
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-closing-bracket-location': [
      'error',
      {
        selfClosing: 'after-props',
        nonEmpty: 'after-props'
      }
    ],
    'react/jsx-props-no-multi-spaces': 'error',
    'import/exports-last': 'error',
    'require-jsdoc': 0 // TODO: `0` for now but later should be on by being removed
    // TODO: double-check
    // "prettier/prettier": 2
  }
};
