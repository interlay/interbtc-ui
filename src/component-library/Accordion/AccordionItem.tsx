import { useButton } from '@react-aria/button';
import { FocusRing, useFocusRing } from '@react-aria/focus';
import { mergeProps, useId } from '@react-aria/utils';
import { ButtonHTMLAttributes, Key, ReactNode, RefObject, useEffect, useRef, useState } from 'react';

import {
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemWrapper,
  StyledChevronDown
} from './Accordion.style';
import { useAccordionContext } from './AccordionContext';
import { AccordionItemRegion } from './AccordionItemRegion';

// The `collection` variables contains a set o Keys mapped to
// elements references. Each component gets their identitiy from
// getting their key using their ref object.
const useKey = (ref: RefObject<HTMLDivElement>): Key | undefined => {
  const { collection } = useAccordionContext();

  const [key, setKey] = useState<Key>();

  useEffect(() => {
    if (!collection || !ref.current) return;

    const elementKey = collection.get(ref.current);

    if (!elementKey) return;

    setKey(elementKey);
  }, [collection, key, ref]);

  return key;
};

type Props = {
  title: ReactNode;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type AccordionItemProps = Props & NativeAttrs;

const AccordionItem = ({ className, style, title, children, ...props }: AccordionItemProps): JSX.Element => {
  const { disabledKeys, expandedKeys, updateKeys } = useAccordionContext();

  const accordionItemRef = useRef<HTMLDivElement>(null);
  const key = useKey(accordionItemRef);

  const isDisabled = !!key && !!disabledKeys?.has(key);
  const isExpanded = !!key && !!expandedKeys?.has(key);

  const buttonId = useId();
  const regionId = useId();

  const btnRef = useRef<HTMLButtonElement>(null);

  const { buttonProps: ariaButtonProps } = useButton(
    mergeProps(props as any, {
      id: buttonId,
      elementType: 'button',
      isDisabled,
      onPress: () => key && updateKeys?.(key)
    }),
    btnRef
  );

  const { focusProps, isFocusVisible } = useFocusRing(props);

  const buttonProps: ButtonHTMLAttributes<unknown> = {
    ...mergeProps(ariaButtonProps, focusProps),
    'aria-expanded': isExpanded,
    'aria-controls': isExpanded ? regionId : undefined
  };

  const regionProps = {
    id: regionId,
    role: 'region',
    'aria-labelledby': buttonId
  };

  return (
    <StyledAccordionItemWrapper $isDisabled={isDisabled} className={className} style={style} ref={accordionItemRef}>
      <StyledAccordionItemHeading size='base'>
        <FocusRing within>
          <StyledAccordionItemButton
            {...buttonProps}
            ref={btnRef}
            $isFocusVisible={isFocusVisible}
            $isDisabled={isDisabled}
          >
            {title}
            <StyledChevronDown role='img' $isExpanded={isExpanded} />
          </StyledAccordionItemButton>
        </FocusRing>
      </StyledAccordionItemHeading>
      <AccordionItemRegion {...regionProps} isExpanded={isExpanded}>
        {children}
      </AccordionItemRegion>
    </StyledAccordionItemWrapper>
  );
};

export { AccordionItem };
export type { AccordionItemProps };
