import { useAccordionItem } from '@react-aria/accordion';
import { FocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { TreeState } from '@react-stately/tree';
import { Node } from '@react-types/shared';
import { useRef } from 'react';

import {
  StyledAccordionItemBtn,
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemWrapper
} from './Accordion.style';

type AccordionItemProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};

const AccordionItem = <T extends Record<string, unknown>>(props: AccordionItemProps<T>): JSX.Element => {
  const ref = useRef<HTMLButtonElement>(null);
  const { state, item } = props;
  const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref);
  const isOpen = state.expandedKeys.has(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const { isHovered, hoverProps } = useHover({ isDisabled });

  return (
    <StyledAccordionItemWrapper $isOpen={isOpen} $isDisabled={isDisabled}>
      <StyledAccordionItemHeading>
        <FocusRing within>
          <StyledAccordionItemButton {...mergeProps(buttonProps, hoverProps)} ref={ref} $isHovered={isHovered}>
            {direction === 'ltr' ? (
              <ChevronRightMedium
                aria-hidden='true'
                UNSAFE_className={classNames(styles, 'spectrum-AccordionItem-itemIndicator')}
              />
            ) : (
              <ChevronLeftMedium
                aria-hidden='true'
                UNSAFE_className={classNames(styles, 'spectrum-AccordionItem-itemIndicator')}
              />
            )}
            {item.props.title}
          </StyledAccordionItemButton>
        </FocusRing>
      </StyledAccordionItemHeading>
      <div {...regionProps} className={classNames(styles, 'spectrum-AccordionItem-itemContent')}>
        {item.props.children}
      </div>
    </StyledAccordionItemWrapper>
  );
};

export { AccordionItem };
export type { AccordionItemProps };
