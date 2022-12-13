import { useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, HTMLAttributes } from 'react';

import { Colors, Orientation } from '../utils/prop-types';
import { StyledDivider } from './Divider.style';

type Props = {
  orientation: Orientation;
  color?: Colors;
  as?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type DividerProps = Props & NativeAttrs;

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ as, orientation, color = 'primary', ...props }, ref): JSX.Element => {
    const elementType = as || orientation === 'vertical' ? 'div' : 'hr';

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
        {...mergeProps(separatorProps, props)}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };
