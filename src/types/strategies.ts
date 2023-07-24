import { PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { CurrencyExt } from '@interlay/interbtc-api';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

enum StrategyRisk {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

enum StrategyType {
  BTC_LOW_RISK = 'BTC_LOW_RISK'
}

interface InfographicsNode {
  icon: ForwardRefExoticComponent<RefAttributes<SVGSVGElement>>;
  text: string;
}

interface Strategy {
  path: string;
  currency: CurrencyExt;
  title: string;
  tags: string[];
  descriptionCard: string;
  description: string;
  infographicsMiddleNode: InfographicsNode;
  risk: StrategyRisk;
}

type Strategies = {
  [type in StrategyType]: Strategy;
};

// Define strategies here.
const STRATEGIES: Strategies = {
  [StrategyType.BTC_LOW_RISK]: {
    path: 'btc-low-risk',
    currency: WRAPPED_TOKEN,
    title: 'BTC passive income',
    tags: ['Passive income'],
    descriptionCard:
      'Generate passive income by offering your IBTC to lending markets and benefit from automatic compounding rewards.',
    description:
      'Discover a straightforward and low-risk approach to generate passive income. This strategy lends out deposited IBTC to borrowers, allowing you to earn interest effortlessly.',
    infographicsMiddleNode: {
      icon: PresentationChartBarIcon,
      text: `Provide ${WRAPPED_TOKEN.ticker} to borrow market`
    },
    risk: StrategyRisk.LOW
  }
};

export { STRATEGIES, StrategyRisk, StrategyType };
export type { InfographicsNode, Strategies, Strategy };
