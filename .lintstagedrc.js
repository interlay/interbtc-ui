
module.exports = {
  './src/**/*.{ts,tsx,js,jsx}': [
    'sh -c "yarn type-check"',
    'yarn lint-fix'
  ],
  // TODO: double-check
  // './src/**/*.{ts,tsx,js,jsx,scss}': 'yarn format'
};
