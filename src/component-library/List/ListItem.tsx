/* eslint-disable @typescript-eslint/ban-types */
import { useFocusRing } from '@react-aria/focus';
import { useGridListItem } from '@react-aria/gridlist';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { ListState } from '@react-stately/list';
import { Node } from '@react-types/shared';
import { useMemo, useRef } from 'react';

import { Flex, FlexProps } from '../Flex';
import { Variants } from '../utils/prop-types';
import { StyledListItem } from './List.style';

type Props = {
  variant?: Variants | 'card';
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ListItemProps = Props & InheritAttrs;

type InternalProps<T extends object> = ListItemProps & { item: Node<T>; state: ListState<T> };

const ListItem = <T extends object>({ item, state, variant = 'primary' }: InternalProps<T>): JSX.Element => {
  const ref = useRef(null);
  const { rowProps, gridCellProps, isDisabled } = useGridListItem({ node: item }, state, ref);

  const isInteractable = state.selectionManager.selectionMode !== 'none' && !isDisabled;

  const { isHovered, hoverProps } = useHover({ isDisabled: !isInteractable });
  const { focusProps, isFocusVisible } = useFocusRing();

  const props = useMemo(
    () => Object.assign({}, item.props, { title: undefined, textValue: undefined, 'aria-label': undefined }),
    [item.props]
  );

  return (
    <StyledListItem
      {...mergeProps(rowProps, hoverProps, focusProps)}
      ref={ref}
      $variant={variant}
      $isDisabled={isDisabled}
      $isHovered={isHovered}
      $isInteractable={isInteractable}
      $isFocusVisible={isFocusVisible}
    >
      <Flex {...mergeProps(gridCellProps, props)}>{item.rendered}</Flex>
    </StyledListItem>
  );
};

export { ListItem };
export type { ListItemProps };
