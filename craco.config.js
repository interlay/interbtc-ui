
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
    configure: webpackConfig => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });

      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      });

      webpackConfig.module.rules.push({
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      });

      // Fixes dtrace-provider compilation bug described here:
      // https://github.com/chrisa/node-dtrace-provider/issues/114
      webpackConfig.externals = [
        'dtrace-provider'
      ];

      return webpackConfig;
    }
  }
};
