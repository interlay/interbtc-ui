import { DlProps } from '@/component-library';

import { StyledDl } from './TransactionDetails.style';

type TransactionDetailsProps = DlProps;

const TransactionDetails = ({ children, direction = 'column', ...props }: TransactionDetailsProps): JSX.Element => (
  <StyledDl direction={direction} gap='spacing0' {...props}>
    {children}
  </StyledDl>
);

export { TransactionDetails };
export type { TransactionDetailsProps };
