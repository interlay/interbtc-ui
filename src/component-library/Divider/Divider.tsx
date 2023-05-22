import { useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, HTMLAttributes } from 'react';

import { DividerVariants, ElementTypeProp, Orientation, Sizes } from '../utils/prop-types';
import { StyledDivider } from './Divider.style';

type Props = {
  orientation?: Orientation;
  color?: DividerVariants;
  size?: Sizes;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type DividerProps = Props & NativeAttrs & ElementTypeProp;

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    { elementType: elementTypeProp, orientation = 'horizontal', color = 'primary', size = 'small', ...props },
    ref
  ): JSX.Element => {
    const elementType = elementTypeProp || orientation === 'vertical' ? 'div' : 'hr';

    const { separatorProps } = useSeparator({
      ...props,
      elementType
    });

    return (
      <StyledDivider
        ref={ref}
        as={elementType}
        $color={color}
        $orientation={orientation}
        $size={size}
        {...mergeProps(separatorProps, props)}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };
