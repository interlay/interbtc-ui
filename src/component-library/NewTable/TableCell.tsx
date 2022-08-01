import { useFocusRing } from '@react-aria/focus';
import { useTableCell } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { useRef } from 'react';

const TableCell = ({ cell, state }: any): JSX.Element => {
  const ref = useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      style={{
        padding: '5px 10px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
        cursor: 'default'
      }}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
};

export { TableCell };
