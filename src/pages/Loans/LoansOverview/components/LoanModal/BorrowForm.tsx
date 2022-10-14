import { LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, H3, P, Stack, TokenInput } from '@/component-library';
import { BorrowAction } from '@/types/loans';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { StyledDItem, StyledDl } from './LoanModal.style';

const getContentMap = (t: TFunction) => ({
  borrow: {
    title: t('loans.borrow')
  },
  repay: {
    title: t('loans.repay')
  }
});

type BorrowFormProps = {
  asset: LoanAsset;
  variant: BorrowAction;
};

const BorrowForm = ({ asset, variant }: BorrowFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    getNewBorrowLimitUSDValue
  } = useGetAccountLoansOverview();

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
          valueInUSD='$0.00'
          tokenSymbol={asset.currency.ticker}
          balance={100}
          balanceInUSD={100}
        />
        <StyledDl>
          <StyledDItem>
            <dt>APY</dt>
            <dd>{formatNumber(asset.borrowApy.toNumber())}%</dd>
          </StyledDItem>
          {variant === 'borrow' && asset.borrowReward && (
            <StyledDItem>
              <dt>{asset.borrowReward.currency.ticker} Rewards</dt>
              <dd>{formatNumber(asset.borrowReward.apy.toNumber())}%</dd>
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

export { BorrowForm };
export type { BorrowFormProps };
