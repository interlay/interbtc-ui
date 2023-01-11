import { FlexProps } from '../Flex';
import { CardVariants, Wrapper } from './Card.style';

type Props = {
  variant?: CardVariants;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type CardProps = Props & InheritAttrs;

const Card = ({
  variant = 'default',
  role = 'section',
  direction = 'column',
  children,
  ...props
}: CardProps): JSX.Element => (
  <Wrapper role={role} variant={variant} direction={direction} {...props}>
    {children}
  </Wrapper>
);

export { Card };
export type { CardProps };
