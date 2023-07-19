import { Trade } from '@interlay/interbtc-api';

import { formatPercentage } from '@/common/utils/utils';
import { Accordion, AccordionItem } from '@/component-library';
import { TransactionDetailsDd, TransactionDetailsDt, TransactionDetailsGroup } from '@/components';

import { StyledTransactionDetails } from './SwapInfo.style';

type SwapInfoProps = {
  trade: Trade;
  slippage: number;
};

const SwapInfo = ({ trade, slippage }: SwapInfoProps): JSX.Element | null => {
  const { inputAmount, outputAmount, executionPrice, priceImpact } = trade;

  const title = `1 ${inputAmount.currency.ticker} = ${executionPrice.toHuman()} ${outputAmount.currency.ticker}`;

  const minimumReceived = outputAmount.sub(outputAmount.mul(slippage).div(100));

  return (
    <StyledTransactionDetails>
      <Accordion size='xs'>
        <AccordionItem hasChildItems={false} key='info' title={title}>
          <TransactionDetailsGroup>
            <TransactionDetailsDt>Expected Output</TransactionDetailsDt>
            <TransactionDetailsDd>
              {outputAmount.toHuman()} {outputAmount.currency.ticker}
            </TransactionDetailsDd>
          </TransactionDetailsGroup>
          <TransactionDetailsGroup>
            <TransactionDetailsDt>Minimum Received</TransactionDetailsDt>
            <TransactionDetailsDd>
              {minimumReceived.toHuman()} {outputAmount.currency.ticker}
            </TransactionDetailsDd>
          </TransactionDetailsGroup>
          <TransactionDetailsGroup>
            <TransactionDetailsDt>Price Impact</TransactionDetailsDt>
            {/* TODO: handle small percentages */}
            <TransactionDetailsDd>{formatPercentage(priceImpact.toNumber())}</TransactionDetailsDd>
          </TransactionDetailsGroup>
        </AccordionItem>
      </Accordion>
    </StyledTransactionDetails>
  );
};

export { SwapInfo };
export type { SwapInfoProps };
