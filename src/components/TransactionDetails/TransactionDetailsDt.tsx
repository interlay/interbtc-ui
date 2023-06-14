import { ReactNode } from 'react';

import { Dt, DtProps, Tooltip } from '@/component-library';

import { StyledInformationCircle } from './TransactionDetails.style';

type Props = {
  tooltipLabel?: ReactNode;
};

type InheritAttrs = Omit<DtProps, keyof Props>;

type TransactionDetailsDtProps = Props & InheritAttrs;

const TransactionDetailsDt = ({
  color = 'primary',
  size = 'xs',
  tooltipLabel,
  children,
  ...props
}: TransactionDetailsDtProps): JSX.Element => (
  <Dt color={color} size={size} {...props}>
    {children}
    {tooltipLabel && (
      <Tooltip label='The bridge fee paid to the vaults, relayers and maintainers of the system'>
        <StyledInformationCircle size='s' />
      </Tooltip>
    )}
  </Dt>
);

export { TransactionDetailsDt };
export type { TransactionDetailsDtProps };
