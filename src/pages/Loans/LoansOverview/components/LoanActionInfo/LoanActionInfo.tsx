import { LoanAsset } from '@interlay/interbtc-api';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Dd, DlGroup, Dt } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledDl } from './LoanActionInfo.style';
import { LoanGroup } from './LoanGroup';

type LoanActionInfoProps = {
  variant?: LoanAction;
  asset?: LoanAsset;
  prices?: Prices;
};

const LoanActionInfo = ({ variant, asset, prices }: LoanActionInfoProps): JSX.Element => (
  <StyledDl direction='column' gap='spacing2'>
    {(variant === 'borrow' || variant === 'lend') && <LoanGroup variant={variant} asset={asset} prices={prices} />}
    <DlGroup justifyContent='space-between'>
      <Dt>Fees</Dt>
      <Dd>
        {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
        {displayMonetaryAmountInUSDFormat(
          TRANSACTION_FEE_AMOUNT,
          getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
        )}
        )
      </Dd>
    </DlGroup>
  </StyledDl>
);
export { LoanActionInfo };
export type { LoanActionInfoProps };
