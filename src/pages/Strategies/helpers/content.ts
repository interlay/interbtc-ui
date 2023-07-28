import { TFunction } from 'react-i18next';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { StrategyInfographicsProps } from '../components/StrategyInfographics';
import { StrategyType } from '../types';

type ContentData = {
  title: string;
  summary: string;
  description: string;
  infographics: StrategyInfographicsProps['items'];
};

const getContent = (t: TFunction, type: StrategyType): ContentData => {
  const content: Record<StrategyType, ContentData> = {
    [StrategyType.BTC_LOW_RISK]: {
      title: t('strategies.btc_passive_income'),
      summary: t('strategies.generate_passive_income_by_offering_ticker', { ticker: WRAPPED_TOKEN.ticker }),
      description: t('strategies.low_risk_approach_generate_passive_income', { ticker: WRAPPED_TOKEN.ticker }),
      infographics: [
        { label: `Deposit ${WRAPPED_TOKEN.ticker}`, ticker: WRAPPED_TOKEN.ticker },
        { label: `Provide ${WRAPPED_TOKEN.ticker} to borrow market`, icon: 'presentation' },
        { label: 'Earn Interest', ticker: WRAPPED_TOKEN.ticker }
      ]
    }
  };

  return content[type];
};

export { getContent };
