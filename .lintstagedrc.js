module.exports = {
  './src/**/*.{ts,tsx,js}': [
    'sh -c "yarn type-check"',
    'yarn lint-fix',
    'yarn format'
  ]
};
