
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },

  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });

      return webpackConfig;
    }
  }
};
