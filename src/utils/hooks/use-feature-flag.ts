enum FeatureFlags {
  LENDING = 'lending',
  AMM = 'amm',
  WALLET = 'wallet',
  BANXA = 'banxa',
  EARN_STRATEGIES = 'earn-strategies',
  GEOBLOCK = 'geoblock'
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.LENDING]: process.env.REACT_APP_FEATURE_FLAG_LENDING,
  [FeatureFlags.AMM]: process.env.REACT_APP_FEATURE_FLAG_AMM,
  [FeatureFlags.WALLET]: process.env.REACT_APP_FEATURE_FLAG_WALLET,
  [FeatureFlags.BANXA]: process.env.REACT_APP_FEATURE_FLAG_BANXA,
  [FeatureFlags.EARN_STRATEGIES]: process.env.REACT_APP_FEATURE_FLAG_EARN_STRATEGIES,
  [FeatureFlags.GEOBLOCK]: process.env.REACT_APP_FEATURE_FLAG_GEOBLOCK
};

const useFeatureFlag = (feature: FeatureFlags): boolean => featureFlags[feature] === 'enabled';

export { FeatureFlags, useFeatureFlag };
