import { HTMLAttributes } from 'react';

import { AlignItems, JustifyContent } from '../utils/prop-types';
import { StackContainer } from './Stack.style';

type Spacing = 'none' | 'half' | 'single' | 'double';

type Props = {
  spacing?: Spacing;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type StackProps = Props & NativeAttrs;

const Stack = ({ children, spacing = 'single', justifyContent, alignItems, ...props }: StackProps): JSX.Element => (
  <StackContainer $spacing={spacing} $justifyContent={justifyContent} $alignItems={alignItems} {...props}>
    {children}
  </StackContainer>
);

export { Stack };
export type { Spacing, StackProps };
