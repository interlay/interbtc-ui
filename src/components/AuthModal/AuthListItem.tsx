import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { forwardRef } from 'react';

import { FlexProps } from '@/component-library';
import { useDOMRef } from '@/component-library/utils/dom';

import { StyledItem } from './AuthModal.style';

type Props = {
  onPress?: (e: PressEvent) => void;
  isSelected?: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AuthListItemProps = Props & InheritAttrs;

const AuthListItem = forwardRef<HTMLElement, AuthListItemProps>(
  ({ onPress, isSelected, ...props }, ref): JSX.Element => {
    const elRef = useDOMRef(ref);
    const { buttonProps } = useButton({ onPress, ...props }, elRef);

    return (
      <StyledItem {...mergeProps(props, buttonProps)} aria-selected={isSelected ? 'true' : undefined} ref={elRef} />
    );
  }
);

AuthListItem.displayName = 'AuthListItem';

export { AuthListItem };
export type { AuthListItemProps };
