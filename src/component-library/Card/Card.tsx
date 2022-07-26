import { HTMLAttributes } from 'react';

import { CardVariants, Wrapper } from './Card.style';

type Props = {
  variant?: CardVariants;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CardProps = Props & NativeAttrs;

const Card = ({ variant = 'default', role = 'section', children, ...props }: CardProps): JSX.Element => (
  <Wrapper role={role} variant={variant} {...props}>
    {children}
  </Wrapper>
);

export { Card };
export type { CardProps };
