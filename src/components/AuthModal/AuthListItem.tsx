import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { useRef } from 'react';

import { FlexProps } from '@/component-library';

import { StyledItem } from './AuthModal.style';

type Props = {
  onPress?: (e: PressEvent) => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AuthListItemProps = Props & InheritAttrs;

const AuthListItem = (props: AuthListItemProps): JSX.Element => {
  const ref = useRef<HTMLElement>(null);
  const { buttonProps } = useButton(props, ref);

  return <StyledItem {...mergeProps(props, buttonProps)} ref={ref} />;
};

export { AuthListItem };
export type { AuthListItemProps };
