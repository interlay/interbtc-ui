import { useTableRow } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { HTMLAttributes, useRef } from 'react';

type Props = {
  state: TableState<Record<string, any>>;
  item: GridNode<Record<string, any>>;
};

type NativeAttrs = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>;

type TableRowProps = Props & NativeAttrs;

// TODO: Logic for row selection needs to be added here
const TableRow = ({ item, children, state, ...props }: TableRowProps): JSX.Element => {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableRow(
    {
      node: item
    },
    state,
    ref
  );

  return (
    <tr ref={ref} {...mergeProps(props, rowProps)}>
      {children}
    </tr>
  );
};

export { TableRow };
export type { TableRowProps };
