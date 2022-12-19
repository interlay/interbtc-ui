import { ReactNode } from 'react';

import { Flex } from '../Flex';
import { Label, LabelProps } from '../Label';
import { TokenBalance } from './TokenBalance';

type Props = {
  currency: string;
  balance?: number;
  balanceLabel?: ReactNode;
  decimals?: number;
  isDisabled?: boolean;
  onClickBalance?: (balance?: number) => void;
};

type InheritAttrs = Omit<LabelProps, keyof Props>;

type TokenLabelProps = Props & InheritAttrs;

const TokenLabel = ({
  balance,
  balanceLabel,
  isDisabled,
  onClickBalance,
  decimals,
  currency,
  children,
  ...props
}: TokenLabelProps): JSX.Element => (
  <Flex gap='spacing0' justifyContent='space-between'>
    <Label {...props}>{children}</Label>
    {balance !== undefined && (
      <TokenBalance
        currency={currency}
        value={balance}
        onClickBalance={onClickBalance}
        isDisabled={isDisabled}
        label={balanceLabel}
        decimals={decimals}
      />
    )}
  </Flex>
);

export { TokenLabel };
export type { TokenLabelProps };
