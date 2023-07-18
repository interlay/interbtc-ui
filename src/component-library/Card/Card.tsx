import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { forwardRef } from 'react';

import { FlexProps } from '../Flex';
import { useDOMRef } from '../utils/dom';
import { BorderRadius, CardVariants, Spacing, Variants } from '../utils/prop-types';
import { StyledCard } from './Card.style';

type Props = {
  variant?: CardVariants;
  background?: Variants;
  isHoverable?: boolean;
  isPressable?: boolean;
  isDisabled?: boolean;
  rounded?: BorderRadius;
  padding?: Spacing;
  shadowed?: boolean;
  onPress?: (e: PressEvent) => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type CardProps = Props & InheritAttrs;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      role = 'section',
      direction = 'column',
      background = 'primary',
      isHoverable,
      isPressable,
      children,
      elementType,
      isDisabled,
      rounded = 'xl',
      padding = 'spacing6',
      shadowed = true,
      ...props
    },
    ref
  ): JSX.Element => {
    const cardRef = useDOMRef(ref);
    const { buttonProps } = useButton(
      { elementType: elementType || 'div', isDisabled: !isPressable || isDisabled, ...props },
      cardRef
    );

    return (
      <StyledCard
        role={role}
        $variant={variant}
        $background={background}
        $isHoverable={isHoverable}
        $isPressable={isPressable}
        $rounded={rounded}
        $padding={padding}
        $shadowed={shadowed}
        direction={direction}
        elementType={elementType}
        {...mergeProps(props, isPressable ? buttonProps : {})}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };
