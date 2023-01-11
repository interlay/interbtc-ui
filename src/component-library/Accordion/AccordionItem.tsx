import { useAccordionItem } from '@react-aria/accordion';
import { FocusRing, useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { TreeState } from '@react-stately/tree';
import { Node } from '@react-types/shared';
import { useRef } from 'react';

import {
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemWrapper,
  StyledChevronDown
} from './Accordion.style';
import { AccordionItemRegion } from './AccordionItemRegion';

type AccordionItemProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};
const AccordionItem = <T extends Record<string, unknown>>(props: AccordionItemProps<T>): JSX.Element => {
  const ref = useRef<HTMLButtonElement>(null);
  const { state, item } = props;
  const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref);
  const isExpanded = state.expandedKeys.has(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <StyledAccordionItemWrapper $isDisabled={isDisabled}>
      <StyledAccordionItemHeading size='base'>
        <FocusRing within>
          <StyledAccordionItemButton
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            $isDisabled={isDisabled}
            $isFocusVisible={isFocusVisible}
          >
            {item.props.title}
            <StyledChevronDown role='img' $isExpanded={isExpanded} />
          </StyledAccordionItemButton>
        </FocusRing>
      </StyledAccordionItemHeading>
      <AccordionItemRegion {...regionProps} isExpanded={isExpanded}>
        {item.props.children}
      </AccordionItemRegion>
    </StyledAccordionItemWrapper>
  );
};

export { AccordionItem };
export type { AccordionItemProps };
