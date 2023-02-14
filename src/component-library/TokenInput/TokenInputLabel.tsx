import { ReactNode } from 'react';

import { Flex } from '../Flex';
import { Label, LabelProps } from '../Label';
import { TokenInputBalance } from './TokenInputBalance';

type Props = {
  ticker?: string;
  balance?: string | number;
  balanceLabel?: ReactNode;
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
  ticker,
  children,
  ...props
}: TokenInputLabelProps): JSX.Element => {
  const hasLabel = !!children;

  return (
    <Flex gap='spacing0' justifyContent={hasLabel ? 'space-between' : 'flex-end'}>
      {hasLabel && <Label {...props}>{children}</Label>}
      {balance !== undefined && (
        <TokenInputBalance
          ticker={ticker}
          value={balance}
          onClickBalance={onClickBalance}
          isDisabled={isDisabled}
          label={balanceLabel}
        />
      )}
    </Flex>
  );
};

export { TokenInputLabel };
export type { TokenInputLabelProps };
