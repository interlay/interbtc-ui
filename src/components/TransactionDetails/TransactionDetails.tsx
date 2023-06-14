import { DlProps } from '@/component-library';

import { StyledDl } from './TransactionDetails.style';

type TransactionDetailsProps = DlProps;

const TransactionDetails = ({
  children,
  direction = 'column',
  gap = 'spacing3',
  ...props
}: TransactionDetailsProps): JSX.Element => (
  <StyledDl direction={direction} gap={gap} {...props}>
    {children}
  </StyledDl>
);

export { TransactionDetails };
export type { TransactionDetailsProps };
