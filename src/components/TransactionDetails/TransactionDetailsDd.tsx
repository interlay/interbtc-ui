import { Dd, DdProps } from '@/component-library';

type TransactionDetailsDdProps = DdProps;

const TransactionDetailsDd = ({ color = 'primary', size = 'xs', ...props }: TransactionDetailsDdProps): JSX.Element => (
  <Dd color={color} size={size} {...props} />
);

export { TransactionDetailsDd };
export type { TransactionDetailsDdProps };
