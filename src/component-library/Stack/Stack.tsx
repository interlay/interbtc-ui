import { HTMLAttributes } from 'react';

import { StackContainer } from './Stack.style';

type Props = {
  spacing?: 'half' | 'single' | 'double';
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type StackProps = Props & NativeAttrs;

const Stack = ({ children, spacing = 'single', ...props }: StackProps): JSX.Element => (
  <StackContainer spacing={spacing} {...props}>
    {children}
  </StackContainer>
);

export { Stack };
export type { StackProps };
