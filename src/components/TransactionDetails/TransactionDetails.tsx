import { DlProps } from '@/component-library';

import { StyledDl } from './TransactionDetails.style';

type TransactionDetailsProps = DlProps;

const TransactionDetails = ({ children, ...props }: TransactionDetailsProps): JSX.Element => {
  return <StyledDl {...props}>{children}</StyledDl>;
};

export { TransactionDetails };
export type { TransactionDetailsProps };
