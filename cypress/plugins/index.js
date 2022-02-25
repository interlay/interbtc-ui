/// <reference types="cypress" />

const findWebpack = require('find-webpack');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = on => {
  // find the Webpack config used by react-scripts
  const webpackOptions = findWebpack.getWebpackOptions();

  if (!webpackOptions) {
    throw new Error('Could not find Webpack in this project 😢');
  }

  // https://github.com/cypress-io/cypress-webpack-preprocessor/issues/31
  // https://github.com/bahmutov/find-webpack
  const cleanOptions = {
    reactScripts: true
  };

  findWebpack.cleanForCypress(cleanOptions, webpackOptions);

  webpackOptions.module.rules.push({
    test: /\.js$/,
    loader: require.resolve('@open-wc/webpack-import-meta-loader')
  });

  webpackOptions.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });

  webpackOptions.externals = [
    'dtrace-provider'
  ];

  const options = {
    webpackOptions,
    watchOptions: {}
  };

  on('file:preprocessor', webpackPreprocessor(options));
};
