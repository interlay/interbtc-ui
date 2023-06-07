import { DlGroup, DlGroupProps } from '@/component-library';

type TransactionDetailsGroupProps = DlGroupProps;

const TransactionDetailsGroup = ({
  flex = '1',
  justifyContent = 'space-between',
  ...props
}: TransactionDetailsGroupProps): JSX.Element => <DlGroup flex={flex} justifyContent={justifyContent} {...props} />;

export { TransactionDetailsGroup };
export type { TransactionDetailsGroupProps };
