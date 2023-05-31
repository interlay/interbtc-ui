import { HTMLAttributes } from 'react';

import { StyledUnderlay } from './Overlay.style';

type Props = {
  isTransparent?: boolean;
  isOpen?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type UnderlayProps = Props & NativeAttrs;

const Underlay = ({ isTransparent = false, isOpen = false, ...props }: UnderlayProps): JSX.Element => (
  <StyledUnderlay $isTransparent={isTransparent} $isOpen={isOpen} {...props} />
);

export { Underlay };
export type { UnderlayProps };
