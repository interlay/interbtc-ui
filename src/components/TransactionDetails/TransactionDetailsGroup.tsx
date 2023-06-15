import { DlGroupProps } from '@/component-library';

import { StyledDlGroup } from './TransactionDetails.style';

type TransactionDetailsGroupProps = DlGroupProps;

const TransactionDetailsGroup = ({
  flex = '1',
  justifyContent = 'space-between',
  ...props
}: TransactionDetailsGroupProps): JSX.Element => (
  <StyledDlGroup flex={flex} justifyContent={justifyContent} {...props} />
);

export { TransactionDetailsGroup };
export type { TransactionDetailsGroupProps };
