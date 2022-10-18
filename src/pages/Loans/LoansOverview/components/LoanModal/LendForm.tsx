import { LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, H3, P, Stack, TokenInput } from '@/component-library';
import { LendAction } from '@/types/loans';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { getTokenPrice } from '../../../../../utils/helpers/prices';
import { useGetBalances } from '../../../../../utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '../../../../../utils/hooks/api/use-get-prices';
import { StyledDItem, StyledDl } from './LoanModal.style';
const getContentMap = (t: TFunction) => ({
  lend: {
    title: t('loans.lend')
  },
  withdraw: {
    title: t('loans.withdraw')
  }
});

type LendFormProps = {
  asset: LoanAsset;
  variant: LendAction;
};

const LendForm = ({ asset, variant }: LendFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    getNewBorrowLimitUSDValue
  } = useGetAccountLoansOverview();

  const { data: balances } = useGetBalances();
  const assetFreeBalance = balances ? balances[asset.currency.ticker].free.toBig().toNumber() : 0;

  const prices = useGetPrices();
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const [newBorrowLimit, setNewBorrowLimit] = useState<Big>(borrowLimitUSDValue || Big(0));

  const handleInputAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const monetaryAmount = new MonetaryAmount(asset.currency, event.target.value || 0);
    const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, monetaryAmount);
    setNewBorrowLimit(newBorrowLimit || Big(0));
  };

  return (
    <Stack spacing='double'>
      <div>
        <H3 id={titleId}>
          {content.title} {asset.currency.name}
        </H3>
        <P>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</P>
      </div>
      <Stack>
        <TokenInput
          onChange={handleInputAmountChange}
          valueInUSD='$0.00' // TODO: add price computation once RHF is added
          tokenSymbol={asset.currency.ticker}
          balance={assetFreeBalance}
          balanceInUSD={assetFreeBalance * assetPrice}
        />
        <StyledDl>
          <StyledDItem>
            <dt>APY</dt>
            <dd>{formatNumber(asset.lendApy.toNumber())}%</dd>
          </StyledDItem>
          {variant === 'lend' && asset.lendReward && (
            <StyledDItem>
              <dt>{asset.lendReward.currency.ticker} Rewards</dt>
              <dd>{formatNumber(asset.lendReward.apy.toNumber())}%</dd>
            </StyledDItem>
          )}
          <StyledDItem>
            <dt>Borrow Limit</dt>
            <dd>
              {formatUSD(borrowLimitUSDValue?.toNumber() || 0)} -&gt; {formatUSD(newBorrowLimit.toNumber())}
            </dd>
          </StyledDItem>
        </StyledDl>
        <CTA size='large'>{content.title}</CTA>
      </Stack>
    </Stack>
  );
};

export { LendForm };
export type { LendFormProps };
