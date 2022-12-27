import { ReactNode } from 'react';

import { Flex } from '../Flex';
import { Label, LabelProps } from '../Label';
import { CurrencyBalance } from './CurrencyBalance';

type Props = {
  currency: string;
  balance?: number;
  balanceLabel?: ReactNode;
  decimals?: number;
  isDisabled?: boolean;
  onClickBalance?: (balance?: number) => void;
};

type InheritAttrs = Omit<LabelProps, keyof Props>;

type CurrencyLabelProps = Props & InheritAttrs;

const CurrencyLabel = ({
  balance,
  balanceLabel,
  isDisabled,
  onClickBalance,
  decimals,
  currency,
  children,
  ...props
}: CurrencyLabelProps): JSX.Element => (
  <Flex gap='spacing0' justifyContent='space-between'>
    <Label {...props}>{children}</Label>
    {balance !== undefined && (
      <CurrencyBalance
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

export { CurrencyLabel };
export type { CurrencyLabelProps };
