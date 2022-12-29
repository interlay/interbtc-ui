import { useButton } from '@react-aria/button';
import { FocusRing } from '@react-aria/focus';
import { mergeProps, useId } from '@react-aria/utils';
import { ButtonHTMLAttributes, Key, ReactNode, RefObject, useEffect, useRef, useState } from 'react';

import {
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemRegion,
  StyledAccordionItemWrapper,
  StyledChevronDown
} from './Accordion.style';
import { useAccordionContext } from './AccordionContext';

// Gets the component key from collection
const useKey = (ref: RefObject<HTMLDivElement>): Key => {
  const { collection } = useAccordionContext();

  const [key, setKey] = useState<Key>(-1);

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

  const isDisabled = !!disabledKeys?.has(key);
  const isExpanded = !!expandedKeys?.has(key);

  const buttonId = useId();
  const regionId = useId();

  const btnRef = useRef<HTMLButtonElement>(null);

  const { buttonProps: ariaButtonProps } = useButton(
    mergeProps(props as any, {
      id: buttonId,
      elementType: 'button',
      isDisabled,
      onPress: () => updateKeys?.(key)
    }),
    btnRef
  );

  const buttonProps: ButtonHTMLAttributes<unknown> = {
    ...ariaButtonProps,
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
          <StyledAccordionItemButton {...buttonProps} ref={btnRef} $isDisabled={isDisabled}>
            {title}
            <StyledChevronDown role='img' $isExpanded={isExpanded} />
          </StyledAccordionItemButton>
        </FocusRing>
      </StyledAccordionItemHeading>
      <StyledAccordionItemRegion {...regionProps} $isExpanded={isExpanded}>
        {children}
      </StyledAccordionItemRegion>
    </StyledAccordionItemWrapper>
  );
};

export { AccordionItem };
export type { AccordionItemProps };
