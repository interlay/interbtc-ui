const path = require('path');
const { when } = require("@craco/craco");
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  // TODO: only for app
  style: {
    postcss: {
      plugins: [
        // TODO: should type properly
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('tailwindcss')('./src/tailwind.config.js'),
        require('autoprefixer')
      ]
    }
  },

  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });

      // Resolve Webpack 4 compile error with polkadot.js 7.x
      // https://polkadot.js.org/docs/usage/FAQ#on-webpack-4-i-have-a-parse-error-on-importmetaurl
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      });

      // Fixes dtrace-provider compilation bug described here:
      // https://github.com/chrisa/node-dtrace-provider/issues/114
      webpackConfig.externals = ['dtrace-provider'];

      return webpackConfig;
    },
    plugins: {
      // Optinoally add SentryWebpackPlugin when SENTRY_AUTH_TOKEN is set (e.g. in Vercel)
      add: when(process.env.SENTRY_AUTH_TOKEN, () => [
        new SentryWebpackPlugin({
          include: './build/',
          ignoreFile: '.sentrycliignore',
          ignore: ['node_modules', 'craco.config.js',],
        })
      ], [])
    },
  }
};
