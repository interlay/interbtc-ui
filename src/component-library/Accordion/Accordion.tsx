import { AriaAccordionProps, useAccordion } from '@react-aria/accordion';
import { mergeProps } from '@react-aria/utils';
import { useTreeState } from '@react-stately/tree';
import { forwardRef, HTMLAttributes, Ref } from 'react';

import { useDOMRef } from '../utils/dom';
import { FontSize } from '../utils/prop-types';
import { AccordionItem } from './AccordionItem';

type Props = {
  size?: FontSize;
};

type InheritAttrs<T> = Omit<AriaAccordionProps<T>, keyof Props>;

type NativeAttrs<T> = Omit<HTMLAttributes<unknown>, (keyof InheritAttrs<T> & Props) | 'children'>;

type AccordionProps<T = any> = Props & InheritAttrs<T> & NativeAttrs<T>;

const Accordion = <T extends Record<string, unknown>>(
  { size = 'base', ...props }: AccordionProps<T>,
  ref: Ref<HTMLDivElement>
): JSX.Element => {
  const state = useTreeState(props);
  const accordionRef = useDOMRef<HTMLDivElement>(ref);
  const { accordionProps } = useAccordion(props, state, accordionRef);

  return (
    <div {...mergeProps(props, accordionProps)} ref={accordionRef}>
      {[...state.collection].map((item) => (
        <AccordionItem<T> key={item.key} item={item} state={state} size={size} />
      ))}
    </div>
  );
};

Accordion.displayName = 'Accordion';

const _Accordion = forwardRef(Accordion) as <T>(
  props: AccordionProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReturnType<typeof Accordion>;

export { _Accordion as Accordion };
export type { AccordionProps };
