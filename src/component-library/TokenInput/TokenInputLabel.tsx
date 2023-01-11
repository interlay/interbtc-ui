import { ReactNode } from 'react';

import { Flex } from '../Flex';
import { Label, LabelProps } from '../Label';
import { TokenInputBalance } from './TokenInputBalance';

type Props = {
  ticker?: string;
  balance?: number;
  balanceLabel?: ReactNode;
  balanceDecimals?: number;
  isDisabled?: boolean;
  onClickBalance?: (balance?: number) => void;
};

type InheritAttrs = Omit<LabelProps, keyof Props>;

type TokenInputLabelProps = Props & InheritAttrs;

const TokenInputLabel = ({
  balance,
  balanceLabel,
  isDisabled,
  onClickBalance,
  balanceDecimals,
  ticker,
  children,
  ...props
}: TokenInputLabelProps): JSX.Element => (
  <Flex gap='spacing0' justifyContent='space-between'>
    <Label {...props}>{children}</Label>
    {balance !== undefined && (
      <TokenInputBalance
        ticker={ticker}
        value={balance}
        onClickBalance={onClickBalance}
        isDisabled={isDisabled}
        label={balanceLabel}
        decimals={balanceDecimals}
      />
    )}
  </Flex>
);

export { TokenInputLabel };
export type { TokenInputLabelProps };
