import { forwardRef, HTMLAttributes } from 'react';

import { AlignItems, AlignSelf, Direction, ElementTypeProp, JustifyContent, Spacing, Wrap } from '../utils/prop-types';
import { StyledFlex } from './Flex.style';

type Props = {
  gap?: Spacing;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  direction?: Direction;
  flex?: string | number;
  wrap?: Wrap | boolean;
  alignSelf?: AlignSelf;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type FlexProps = Props & NativeAttrs & ElementTypeProp;

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    { children, gap, justifyContent, alignItems, direction, flex, wrap, alignSelf, elementType, ...props },
    ref
  ): JSX.Element => (
    <StyledFlex
      ref={ref}
      as={elementType}
      $gap={gap}
      $justifyContent={justifyContent}
      $alignItems={alignItems}
      $direction={direction}
      $flex={flex}
      $wrap={wrap}
      $alignSelf={alignSelf}
      {...props}
    >
      {children}
    </StyledFlex>
  )
);

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps };
