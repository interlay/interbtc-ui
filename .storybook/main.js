const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-dark-mode'
  ],
  webpackFinal: config => {
    // MEMO: inspired by https://github.com/storybookjs/storybook/issues/3916
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src'),
      'node_modules'
    ];

    // MEMO: inspired by https://github.com/storybookjs/storybook/issues/4038
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          // Filter out the default .css and .module.css rules and replace them with our own.
          ...(config.module.rules = config.module.rules.map(f => {
            if (f.oneOf === undefined) {
              return f;
            }

            return {
              oneOf: f.oneOf.map(r => {
                if (r.test === undefined) {
                  return r;
                }

                if (r.test.toString() === '/\\.css$/') {
                  return {
                    test: /\.css$/,
                    exclude: [/\.module\.css$/, /@storybook/],
                    include: path.resolve(__dirname, '../'),
                    use: [
                      'style-loader',
                      {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 1,
                          sourceMap: false
                        }
                      },
                      'postcss-loader'
                    ]
                  };
                }

                if (r.test.toString() === '/\\.module\\.css$/') {
                  return {
                    test: /\.module\.css$/,
                    exclude: [/@storybook/],
                    include: path.resolve(__dirname, '../'),
                    use: [
                      'style-loader',
                      {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 1,
                          sourceMap: false,
                          modules: true
                        }
                      },
                      'postcss-loader'
                    ]
                  };
                }

                return r;
              })
            };
          }))
        ]
      }
    };
  },
  // MEMO: inspired by https://storybook.js.org/blog/storybook-for-webpack-5/ & https://gist.github.com/shilman/8856ea1786dcd247139b47b270912324
  core: {
    builder: "webpack5"
  }
};
