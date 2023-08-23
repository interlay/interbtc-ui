import { TFunction } from 'react-i18next';

import { StrategyInfographicsProps } from '../components/StrategyInfographics';
import { StrategyData } from '../hooks/use-get-strategies';
import { StrategyType } from '../types';

type ContentData = {
  title: string;
  summary: string;
  description: string;
  infographics: Pick<StrategyInfographicsProps, 'items' | 'isCyclic' | 'endCycleLabel'>;
};

const getContent = (strategy: StrategyData, t: TFunction): ContentData => {
  switch (strategy.type) {
    case StrategyType.PASSIVE_INCOME: {
      const { primary } = strategy.currencies;

      return {
        title: t('strategies.btc_passive_income'),
        summary: t('strategies.generate_passive_income_by_offering_ticker', {
          ticker: primary.ticker
        }),
        description: t('strategies.low_risk_approach_generate_passive_income', {
          ticker: primary.ticker
        }),
        infographics: {
          items: [
            { label: t('strategies.deposit_ticker', { ticker: primary.ticker }), ticker: primary.ticker },
            {
              label: t('strategies.provider_ticker_to_borrow_market', { ticker: primary.ticker }),
              icon: 'presentation'
            },
            { label: t('strategies.earn_interest'), ticker: primary.ticker }
          ]
        }
      };
    }
    case StrategyType.LEVERAGE_LONG: {
      const { primary, secondary } = strategy.currencies;

      return {
        title: t('strategies.deposit_ticker_as_collateral', { ticker: primary.ticker }),
        summary: t('strategies.generate_passive_income_by_offering_ticker', {
          ticker: primary.ticker
        }),
        description: t('strategies.low_risk_approach_generate_passive_income', {
          ticker: primary.ticker
        }),
        infographics: {
          items: [
            {
              label: t('strategies.deposit_ticker_as_collateral', { ticker: primary.ticker }),
              ticker: primary.ticker
            },
            {
              label: t('strategies.borrow_ticker', { ticker: secondary.ticker }),
              ticker: secondary.ticker
            },
            {
              label: t('strategies.swap_input_for_output', {
                input: secondary.ticker,
                output: primary.ticker
              }),
              ticker: [secondary.ticker, primary.ticker]
            }
          ],
          isCyclic: true,
          endCycleLabel: t('strategies.repeat_until_desired_leverage', { start: 1, end: 5 })
        }
      };
    }
  }
};

export { getContent };
