import { useTableRowGroup } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { HTMLAttributes } from 'react';

import { StyledTableRowGroup } from './Table.style';

type Props = {
  // TODO: create a util type for this
  as?: keyof JSX.IntrinsicElements;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TableRowGroupProps = Props & NativeAttrs;

const TableRowGroup = ({ as = 'thead', children, ...props }: TableRowGroupProps): JSX.Element => {
  const { rowGroupProps } = useTableRowGroup();

  return (
    <StyledTableRowGroup isBodyRowGroup={as === 'tbody'} as={as} {...mergeProps(props, rowGroupProps)}>
      {children}
    </StyledTableRowGroup>
  );
};

export { TableRowGroup };
export type { TableRowGroupProps };
