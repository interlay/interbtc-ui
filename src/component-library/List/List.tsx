import { useGridList } from '@react-aria/gridlist';
import { mergeProps } from '@react-aria/utils';
import { ListProps as StatelyListProps, useListState } from '@react-stately/list';
import { forwardRef } from 'react';

import { Flex, FlexProps } from '../Flex';
import { useDOMRef } from '../utils/dom';
import { Variants } from '../utils/prop-types';
import { ListItem } from './ListItem';

type Props = {
  variant?: Variants;
};

type InheritAttrs = Omit<StatelyListProps<Record<string, unknown>>, keyof Props>;

type NativeAttrs = Omit<FlexProps, keyof Props>;

type ListProps = Props & NativeAttrs & InheritAttrs;

const List = forwardRef<HTMLUListElement, ListProps>(
  ({ variant = 'primary', direction = 'column', onSelectionChange, ...props }, ref): JSX.Element => {
    const ariaProps = { onSelectionChange, ...props };
    const state = useListState(ariaProps);
    const listRef = useDOMRef<HTMLUListElement>(ref);
    const { gridProps } = useGridList(ariaProps, state, listRef);

    return (
      <Flex {...mergeProps(gridProps, props)} elementType='ul' ref={listRef} direction={direction} gap='spacing2'>
        {[...state.collection].map((item) => (
          <ListItem key={item.key} item={item} state={state} variant={variant} />
        ))}
      </Flex>
    );
  }
);

List.displayName = 'List';

export { List };
export type { ListProps };
