enum FeatureFlags {
  LENDING = 'lending',
  SWAP = 'swap'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.LENDING]: process.env.REACT_APP_FEATURE_FLAG_LENDING,
  [FeatureFlags.SWAP]: process.env.REACT_APP_FEATURE_FLAG_SWAP
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
