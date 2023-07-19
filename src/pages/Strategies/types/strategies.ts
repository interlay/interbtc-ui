import { WRAPPED_TOKEN } from '@/config/relay-chains';

enum StrategyType {
  LOW_RISK_SIMPLE_WRAPPED = 'LOW_RISK_SIMPLE_WRAPPED'
}

// Define strategies here.
const STRATEGY_INFORMATION = {
  [StrategyType.LOW_RISK_SIMPLE_WRAPPED]: {
    currency: WRAPPED_TOKEN,
    title: 'BTC passive income',
    tags: ['Low risk strategy', 'Passive income'],
    description:
      'Discover a straightforward and low-risk approach to generate passive income. This strategy lends out deposited IBTC to borrowers, allowing you to earn interest effortlessly.',
    infographicsUrl: ' ',
    riskInformationLink: 'https://docs.interlay.io'
  }
};

export { STRATEGY_INFORMATION, StrategyType };
