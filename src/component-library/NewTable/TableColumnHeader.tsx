import { useFocusRing } from '@react-aria/focus';
import { useTableColumnHeader } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { useRef } from 'react';

const TableColumnHeader = ({ column, state }: any): JSX.Element => {
  const ref = useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: column.colspan > 1 ? 'center' : 'left',
        padding: '5px 10px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
        cursor: 'default'
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <span
          aria-hidden='true'
          style={{
            padding: '0 2px',
            visibility: state.sortDescriptor?.column === column.key ? 'visible' : 'hidden'
          }}
        >
          {arrowIcon}
        </span>
      )}
    </th>
  );
};

export { TableColumnHeader };
