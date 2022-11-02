import { HTMLAttributes } from 'react';

import { AlignItems, Direction, JustifyContent, Spacing } from '../utils/prop-types';
import { StyledFlex } from './Flex.style';

type Props = {
  gap?: Spacing;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  direction?: Direction;
  as?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type FlexProps = Props & NativeAttrs;

const Flex = ({
  children,
  gap = '4',
  justifyContent,
  alignItems,
  direction = 'column',
  as,
  ...props
}: FlexProps): JSX.Element => (
  <StyledFlex
    $gap={gap}
    $justifyContent={justifyContent}
    $alignItems={alignItems}
    $direction={direction}
    as={as}
    {...props}
  >
    {children}
  </StyledFlex>
);

export { Flex };
export type { FlexProps };
