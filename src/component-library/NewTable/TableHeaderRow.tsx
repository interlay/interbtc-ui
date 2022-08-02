import { useTableHeaderRow } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { HTMLAttributes, useRef } from 'react';

type Props = {
  state: TableState<Record<string, any>>;
  item: GridNode<Record<string, any>>;
};

type NativeAttrs = Omit<HTMLAttributes<HTMLTableCellElement>, keyof Props>;

type TableHeaderRowProps = Props & NativeAttrs;

const TableHeaderRow = ({ item, state, children, ...props }: TableHeaderRowProps): JSX.Element => {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr ref={ref} {...mergeProps(props, rowProps)}>
      {children}
    </tr>
  );
};

export { TableHeaderRow };
export type { TableHeaderRowProps };
