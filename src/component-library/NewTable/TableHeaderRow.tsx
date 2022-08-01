import { useTableHeaderRow } from '@react-aria/table';
import { useRef } from 'react';

const TableHeaderRow = ({ item, state, children }: any): JSX.Element => {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
};

export { TableHeaderRow };
