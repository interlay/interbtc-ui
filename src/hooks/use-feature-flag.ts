enum FeatureFlags {
  STRATEGIES = 'strategies',
  GEOBLOCK = 'geoblock',
  ONBOARDING = 'onboarding',
  BOB_X_INTERLAY = 'bob-x-interlay'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.STRATEGIES]: process.env.REACT_APP_FEATURE_FLAG_STRATEGIES,
  [FeatureFlags.GEOBLOCK]: process.env.REACT_APP_FEATURE_FLAG_GEOBLOCK,
  [FeatureFlags.ONBOARDING]: process.env.REACT_APP_FEATURE_FLAG_ONBOARDING,
  [FeatureFlags.BOB_X_INTERLAY]: process.env.REACT_APP_FEATURE_FLAG_BOB_X_INTERLAY
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
