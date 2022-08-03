import { useTableRowGroup } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { HTMLAttributes } from 'react';

type Props = {
  // TODO: create a util type for this
  as?: keyof JSX.IntrinsicElements;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TableRowGroupProps = Props & NativeAttrs;

const TableRowGroup = ({ as: Component = 'thead', children, ...props }: TableRowGroupProps): JSX.Element => {
  const { rowGroupProps } = useTableRowGroup();

  return <Component {...mergeProps(props, rowGroupProps)}>{children}</Component>;
};

export { TableRowGroup };
export type { TableRowGroupProps };
