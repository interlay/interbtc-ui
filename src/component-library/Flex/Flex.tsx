import { forwardRef, HTMLAttributes } from 'react';

import { AlignItems, AlignSelf, Direction, JustifyContent, Spacing, Wrap } from '../utils/prop-types';
import { Responsive, StyledFlex } from './Flex.style';

type Props = {
  gap?: Spacing;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  direction?: Responsive<Direction>;
  flex?: string | number;
  wrap?: Wrap | boolean;
  alignSelf?: AlignSelf;
  as?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type FlexProps = Props & NativeAttrs;

const Flex = forwardRef<HTMLElement, FlexProps>(
  ({ children, gap, justifyContent, alignItems, direction, flex, wrap, alignSelf, as, ...props }, ref): JSX.Element => (
    <StyledFlex
      ref={ref}
      $gap={gap}
      $justifyContent={justifyContent}
      $alignItems={alignItems}
      $direction={direction}
      $flex={flex}
      $wrap={wrap}
      $alignSelf={alignSelf}
      as={as}
      {...props}
    >
      {children}
    </StyledFlex>
  )
);

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps };
