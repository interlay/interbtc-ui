import { HTMLAttributes } from 'react';

import { AlignItems, AlignSelf, Direction, JustifyContent, Spacing, Wrap } from '../utils/prop-types';
import { StyledFlex } from './Flex.style';

type Props = {
  gap?: Spacing;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  direction?: Direction;
  flex?: string | number;
  wrap?: Wrap | boolean;
  alignSelf?: AlignSelf;
  as?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type FlexProps = Props & NativeAttrs;

const Flex = ({
  children,
  gap,
  justifyContent,
  alignItems,
  direction,
  flex,
  wrap,
  alignSelf,
  as,
  ...props
}: FlexProps): JSX.Element => (
  <StyledFlex
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
);

export { Flex };
export type { FlexProps };
