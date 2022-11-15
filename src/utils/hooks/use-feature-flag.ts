enum FeatureFlags {
  LENDING = 'lending'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.LENDING]: process.env.REACT_APP_FEATURE_FLAG_LENDING
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
