import { FlexProps } from '../Flex';
import { Variants } from '../utils/prop-types';
import { CardVariants, Wrapper } from './Card.style';

type Props = {
  variant?: CardVariants;
  color?: Variants;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type CardProps = Props & InheritAttrs;

const Card = ({
  variant = 'default',
  role = 'section',
  direction = 'column',
  color = 'primary',
  children,
  ...props
}: CardProps): JSX.Element => (
  <Wrapper role={role} $variant={variant} $color={color} direction={direction} {...props}>
    {children}
  </Wrapper>
);

export { Card };
export type { CardProps };
