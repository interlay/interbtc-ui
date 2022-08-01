import { useFocusRing } from '@react-aria/focus';
import { useTableRow } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { useRef } from 'react';

const TableRow = ({ item, children, state }: any): JSX.Element => {
  const ref = useRef<HTMLTableRowElement>(null);
  const isSelected = state.selectionManager.isSelected(item.key);
  const { rowProps, isPressed } = useTableRow(
    {
      node: item
    },
    state,
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <tr
      style={{
        background: isSelected
          ? 'blueviolet'
          : isPressed
          ? 'var(--spectrum-global-color-gray-400)'
          : item.index % 2
          ? 'var(--spectrum-alias-highlight-hover)'
          : 'none',
        color: isSelected ? 'white' : undefined,
        outline: isFocusVisible ? '2px solid orange' : 'none'
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </tr>
  );
};

export { TableRow };
