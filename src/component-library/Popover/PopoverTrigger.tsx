import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import React, { Children, cloneElement, ElementType, ReactNode, RefObject } from 'react';

import { useDOMRef } from '../utils/dom';
import { usePopoverContext } from './PopoverContext';

type Props = {
  children?: ReactNode;
};

type PopoverTriggerProps = Props;

const PopoverTrigger = ({ children }: PopoverTriggerProps): JSX.Element => {
  const { triggerRef, triggerProps: { onPress, ...triggerAriaProps } = {} } = usePopoverContext();
  const ref = useDOMRef<HTMLDivElement>(triggerRef as RefObject<HTMLDivElement>);

  // MEMO: Ensure tooltip has only one child node
  const child = Children.only(children) as React.ReactElement & {
    ref?: React.Ref<any>;
  };

  const elementType = ref.current?.tagName.toLowerCase() as ElementType;

  const { buttonProps } = useButton({ onPress, elementType, isDisabled: elementType === 'button' } || {}, ref);

  const triggerProps =
    elementType === 'button'
      ? mergeProps(child.props, triggerAriaProps, { onPress })
      : mergeProps(child.props, triggerAriaProps, buttonProps);

  const trigger = cloneElement(child, mergeProps(triggerProps, { ref }));

  return trigger;
};

export { PopoverTrigger };
export type { PopoverTriggerProps };
