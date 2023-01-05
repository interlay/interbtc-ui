enum FeatureFlags {
  LENDING = 'lending',
  AMM = 'amm'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.LENDING]: process.env.REACT_APP_FEATURE_FLAG_LENDING,
  [FeatureFlags.AMM]: process.env.REACT_APP_FEATURE_FLAG_AMM
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
