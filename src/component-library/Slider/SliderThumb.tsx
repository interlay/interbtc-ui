import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { AriaSliderThumbProps, useSliderThumb } from '@react-aria/slider';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SliderState } from '@react-stately/slider';
import { HTMLAttributes, RefObject } from 'react';

import { useDOMRef } from '../utils/dom';
import { StyledInput, StyledSliderThumb } from './Slider.style';

type Props = {
  trackRef: RefObject<HTMLElement>;
  state: SliderState;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSliderThumbProps, keyof Props>;

type SliderThumbProps = Props & NativeAttrs & InheritAttrs;

const SliderThumb = ({ state, trackRef, ...props }: SliderThumbProps): JSX.Element => {
  const inputRef = useDOMRef<HTMLInputElement>(null);

  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb(
    {
      ...props,
      inputRef,
      trackRef
    },
    state
  );

  const { hoverProps, isHovered } = useHover({});

  const { isFocusVisible, focusProps } = useFocusRing({ within: true });

  return (
    <StyledSliderThumb
      {...mergeProps(thumbProps, hoverProps, focusProps)}
      $isDragged={isDragging}
      $isFocused={isFocused}
      $isHovered={isHovered}
      $isFocusVisible={isFocusVisible}
      role='presentation'
    >
      <VisuallyHidden>
        <StyledInput style={thumbProps.style} ref={inputRef} {...inputProps} />
      </VisuallyHidden>
    </StyledSliderThumb>
  );
};

export { SliderThumb };
export type { SliderThumbProps };
