import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Accordion, AccordionItem, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { SwapPair } from '@/types/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledCard } from './SwapInfo.style';

type SwapInfoProps = {
  pair: SwapPair;
};

const SwapInfo = ({ pair }: SwapInfoProps): JSX.Element | null => {
  const prices = useGetPrices();

  return (
    <StyledCard>
      <Accordion size='s'>
        <AccordionItem
          hasChildItems={false}
          key='info'
          title={`1 ${pair.input?.ticker} = 16.062 ${pair.output?.ticker}`}
        >
          <Dl direction='column'>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Expected Output
              </Dt>
              <Dd size='s'>32.124 {pair.output?.ticker}</Dd>
            </DlGroup>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Minimum Received
              </Dt>
              <Dd size='s'>30.111 {pair.output?.ticker}</Dd>
            </DlGroup>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Prices Impace
              </Dt>
              <Dd size='s'>{'<0.01%'}</Dd>
            </DlGroup>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Fees
              </Dt>
              <Dd size='s'>
                {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
                {displayMonetaryAmountInUSDFormat(
                  TRANSACTION_FEE_AMOUNT,
                  getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
                )}
                )
              </Dd>
            </DlGroup>
          </Dl>
        </AccordionItem>
      </Accordion>
    </StyledCard>
  );
};

export { SwapInfo };
export type { SwapInfoProps };
