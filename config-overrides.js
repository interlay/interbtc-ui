
const webpack = require('webpack');

// MEMO: inspired by https://github.com/facebook/create-react-app/issues/11756#issuecomment-1001162736
module.exports = function override(config) {
  config.resolve.fallback = {
    fs: false,
    path: false,
    vm: false,
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    net: false,
    tls: false,
    zlib: false
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  );

  // Fixes dtrace-provider compilation bug described here:
  // https://github.com/chrisa/node-dtrace-provider/issues/114
  config.externals = [
    'dtrace-provider'
  ];

  config.module.rules.push({
    test: /\.m?js$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
};
