enum FeatureFlags {
  STRATEGIES = 'strategies',
  GEOBLOCK = 'geoblock',
  ONBOARDING = 'onboarding'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.STRATEGIES]: process.env.REACT_APP_FEATURE_FLAG_STRATEGIES,
  [FeatureFlags.GEOBLOCK]: process.env.REACT_APP_FEATURE_FLAG_GEOBLOCK,
  [FeatureFlags.ONBOARDING]: process.env.REACT_APP_FEATURE_FLAG_ONBOARDING
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
