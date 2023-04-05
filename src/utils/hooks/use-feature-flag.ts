enum FeatureFlags {
  LENDING = 'lending',
  AMM = 'amm',
  WALLET = 'wallet'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.LENDING]: process.env.REACT_APP_FEATURE_FLAG_LENDING,
  [FeatureFlags.AMM]: process.env.REACT_APP_FEATURE_FLAG_AMM,
  [FeatureFlags.WALLET]: process.env.REACT_APP_FEATURE_FLAG_WALLET
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
