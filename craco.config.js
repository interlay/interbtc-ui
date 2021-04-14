
module.exports = {
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

      return webpackConfig;
    }
  }
};
