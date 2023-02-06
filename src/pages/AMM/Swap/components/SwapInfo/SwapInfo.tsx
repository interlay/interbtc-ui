import { Trade } from '@interlay/interbtc-api';

import {
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  formatNumber,
  formatPercentage
} from '@/common/utils/utils';
import { Accordion, AccordionItem, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledCard } from './SwapInfo.style';

type SwapInfoProps = {
  trade: Trade;
  slippage: number;
};

const SwapInfo = ({ trade, slippage }: SwapInfoProps): JSX.Element | null => {
  const prices = useGetPrices();

  const { inputAmount, outputAmount, executionPrice, priceImpact } = trade;

  const title = `1 ${inputAmount.currency.ticker} = ${formatNumber(executionPrice.toBig().toNumber())} ${
    outputAmount.currency.ticker
  }`;

  const minimumReceived = outputAmount.sub(outputAmount.mul(slippage).div(100));

  return (
    <StyledCard>
      <Accordion size='s'>
        <AccordionItem hasChildItems={false} key='info' title={title}>
          <Dl direction='column'>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Expected Output
              </Dt>
              <Dd size='s'>
                {displayMonetaryAmount(outputAmount)} {outputAmount.currency.ticker}
              </Dd>
            </DlGroup>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Minimum Received
              </Dt>
              <Dd size='s'>
                {displayMonetaryAmount(minimumReceived)} {outputAmount.currency.ticker}
              </Dd>
            </DlGroup>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='primary'>
                Prices Impact
              </Dt>
              {/* TODO: handle small percentages */}
              <Dd size='s'>{formatPercentage(priceImpact.toNumber())}</Dd>
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
