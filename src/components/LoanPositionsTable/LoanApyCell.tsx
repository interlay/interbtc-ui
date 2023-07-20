import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Flex } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getApyLabel, getSubsidyRewardApy } from '@/utils/helpers/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { ApyDetails, ApyDetailsGroup, ApyDetailsGroupItem } from '../ApyDetails';
import { Cell } from '../DataGrid';
import { StyledTooltip } from './LoanPositionsTable.style';

type AssetGroupProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices: Prices;
};

const AssetGroup = ({ amount, prices }: AssetGroupProps): JSX.Element => {
  const amountUSD = displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd);
  const value = `${amount.toHuman()} (${amountUSD})`;

  return <ApyDetailsGroupItem label={amount.currency.ticker} value={value} />;
};

type LoanApyCellProps = {
  apy: Big;
  currency: CurrencyExt;
  earnedInterest?: MonetaryAmount<CurrencyExt>;
  accumulatedDebt?: MonetaryAmount<CurrencyExt>;
  rewardsPerYear: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
  isBorrow?: boolean;
  onClick?: () => void;
};

const LoanApyCell = ({
  apy,
  currency,
  rewardsPerYear,
  accumulatedDebt,
  earnedInterest,
  prices,
  isBorrow = false,
  onClick
}: LoanApyCellProps): JSX.Element => {
  const { t } = useTranslation();

  const rewardsApy = getSubsidyRewardApy(currency, rewardsPerYear, prices);

  const totalApy = isBorrow ? (rewardsApy || Big(0)).sub(apy) : apy.add(rewardsApy || 0);

  const totalApyLabel = getApyLabel(totalApy);

  const earnedAsset = accumulatedDebt || earnedInterest;

  const earnedAssetLabel = earnedAsset ? `${earnedAsset.toHuman(8)} ${earnedAsset.currency.ticker}` : undefined;

  const children = <Cell onClick={onClick} label={totalApyLabel} sublabel={earnedAssetLabel} alignSelf='flex-start' />;

  if (!prices) {
    return children;
  }

  const apyLabel = isBorrow
    ? t('loans.borrow_apy_ticker', { ticker: currency.ticker })
    : t('loans.lend_apy_ticker', { ticker: currency.ticker });

  const apyValue = isBorrow ? `-${getApyLabel(apy)}` : getApyLabel(apy);

  const label = (
    <ApyDetails>
      <ApyDetailsGroup title={t('apy_breakdown')}>
        <ApyDetailsGroupItem label={apyLabel} value={apyValue} />
        {!!rewardsApy && (
          <ApyDetailsGroupItem
            label={t('rewards_apr_ticker', { ticker: GOVERNANCE_TOKEN.ticker })}
            value={getApyLabel(rewardsApy)}
          />
        )}
      </ApyDetailsGroup>
      {accumulatedDebt && (
        <ApyDetailsGroup title={t('loans.owed')}>
          <AssetGroup amount={accumulatedDebt} prices={prices} />
        </ApyDetailsGroup>
      )}
      {!!earnedInterest && (
        <ApyDetailsGroup title={t('earned')}>
          <AssetGroup amount={earnedInterest} prices={prices} />
        </ApyDetailsGroup>
      )}
    </ApyDetails>
  );

  // MEMO: wrapping around a Flex so tooltip is placed correctly
  return (
    <Flex>
      <StyledTooltip label={label}>{children}</StyledTooltip>
    </Flex>
  );
};

export { LoanApyCell };
export type { LoanApyCellProps };
