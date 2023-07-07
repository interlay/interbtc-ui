enum FeatureFlags {
  BANXA = 'banxa',
  STRATEGIES = 'strategies',
  GEOBLOCK = 'geoblock',
  ONBOARDING = 'onboarding'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.BANXA]: process.env.REACT_APP_FEATURE_FLAG_BANXA,
  [FeatureFlags.STRATEGIES]: process.env.REACT_APP_FEATURE_FLAG_EARN_STRATEGIES,
  [FeatureFlags.GEOBLOCK]: process.env.REACT_APP_FEATURE_FLAG_GEOBLOCK,
  [FeatureFlags.ONBOARDING]: process.env.REACT_APP_FEATURE_FLAG_ONBOARDING
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
