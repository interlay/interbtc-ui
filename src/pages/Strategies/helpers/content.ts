import { TFunction } from 'react-i18next';

import { StrategyInfographicsProps } from '../components/StrategyInfographics';
import { StrategyData } from '../hooks/use-get-strategies';
import { StrategyType } from '../types';

type ContentData = {
  title: string;
  summary: string;
  description: string;
  infographics: StrategyInfographicsProps['items'];
};

const getContent = (strategy: StrategyData, t: TFunction): ContentData => {
  const content: Record<StrategyType, ContentData> = {
    [StrategyType.BTC_LOW_RISK]: {
      title: t('strategies.btc_passive_income'),
      summary: t('strategies.generate_passive_income_by_offering_ticker', { ticker: strategy.currency.ticker }),
      description: t('strategies.low_risk_approach_generate_passive_income', { ticker: strategy.currency.ticker }),
      infographics: [
        { label: `Deposit ${strategy.currency.ticker}`, ticker: strategy.currency.ticker },
        { label: `Provide ${strategy.currency.ticker} to borrow market`, icon: 'presentation' },
        { label: 'Earn Interest', ticker: strategy.currency.ticker }
      ]
    }
  };

  return content[strategy.type];
};

export { getContent };
