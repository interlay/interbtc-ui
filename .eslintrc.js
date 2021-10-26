module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'import'
    // "prettier"
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // TODO: double-check
    // "plugin:prettier/recommended",
    // "prettier"
    'react-app',
    'react-app/jest',
    'google'
  ],
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // TS ESLinting rules
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    // MEMO: inspired by https://github.com/typescript-eslint/typescript-eslint/issues/2621#issuecomment-701970389
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true
          }
        }
      }
    ],

    // JS ESLinting rules
    'comma-dangle': [
      'error',
      'never'
    ],
    'no-console': 'off', // TODO: `off` for now but later should be `warn`
    indent: [
      'error',
      2
    ],
    'quote-props': [
      'error',
      'as-needed'
    ],
    'capitalized-comments': 'off',
    'max-len': [
      'warn',
      {
        code: 120
      } // 130 on GitHub, 80 on npmjs.org for README.md code blocks
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
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
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'import/exports-last': 'error',
    'require-jsdoc': 0, // TODO: `0` for now but later should be on by being removed
    // TODO: double-check
    // "prettier/prettier": 2
    'new-cap': ['error', { capIsNew: false }],

    // React ESLinting rules
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-first-prop-new-line': [
      'error',
      'multiline'
    ],
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
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'react/jsx-closing-bracket-location': [
      'error',
      {
        selfClosing: 'after-props',
        nonEmpty: 'after-props'
      }
    ],
    'react/jsx-props-no-multi-spaces': 'error'
  }
};
