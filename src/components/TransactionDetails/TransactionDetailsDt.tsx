import { Dt, DtProps } from '@/component-library';

type TransactionDetailsDtProps = DtProps;

const TransactionDetailsDt = ({ color = 'primary', size = 'xs', ...props }: TransactionDetailsDtProps): JSX.Element => (
  <Dt color={color} size={size} {...props} />
);

export { TransactionDetailsDt };
export type { TransactionDetailsDtProps };
