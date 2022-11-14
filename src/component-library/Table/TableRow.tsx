import { useTableRow } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { FocusableElement } from '@react-types/shared';
import { HTMLAttributes, MouseEventHandler, PointerEventHandler, useRef } from 'react';

// TODO: improve solution
const interactiveElements = ['button', 'input'];

// MEMO: Allows us to not emit inherited event from react-aria, if we are trying
// to interact with a element that resides inside of a row cell.
const shouldEmitInheritedEvent = (ref: React.RefObject<HTMLTableRowElement>, targetEl: HTMLElement) => {
  const elementTag = targetEl.tagName.toLowerCase();

  const isInteractiveElement = interactiveElements.includes(elementTag);

  const tableRowCells = [...(ref.current?.cells as any)] as HTMLElement[];

  return !isInteractiveElement || tableRowCells.includes(targetEl);
};

type Props = {
  state: TableState<Record<string, any>>;
  item: GridNode<Record<string, any>>;
};

type NativeAttrs = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>;

type TableRowProps = Props & NativeAttrs;

const TableRow = ({ item, children, state, ...props }: TableRowProps): JSX.Element => {
  const ref = useRef<HTMLTableRowElement>(null);
  const {
    rowProps: { onPointerDown, onPointerUp, onClick, ...otherRowProps }
  } = useTableRow(
    {
      node: item
    },
    state,
    ref
  );

  const handlePointerUp: PointerEventHandler<FocusableElement> = (e) => {
    if (shouldEmitInheritedEvent(ref, e.target as HTMLElement)) {
      onPointerUp?.(e);
    }
  };

  const handlePointerDown: PointerEventHandler<FocusableElement> = (e) => {
    if (shouldEmitInheritedEvent(ref, e.target as HTMLElement)) {
      onPointerDown?.(e);
    }
  };

  const handleClick: MouseEventHandler<FocusableElement> = (e) => {
    if (shouldEmitInheritedEvent(ref, e.target as HTMLElement)) {
      onClick?.(e);
    }
  };

  return (
    <tr
      ref={ref}
      {...mergeProps(props, otherRowProps, {
        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        onClick: handleClick
      })}
    >
      {children}
    </tr>
  );
};

export { TableRow };
export type { TableRowProps };
