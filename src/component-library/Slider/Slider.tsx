import { useNumberFormatter } from '@react-aria/i18n';
import { AriaSliderProps, useSlider } from '@react-aria/slider';
import { useSliderState } from '@react-stately/slider';
import { forwardRef, HTMLAttributes, useRef } from 'react';

import { Label } from '../Label';
import { useDOMRef } from '../utils/dom';
import { StyledBaseTrack, StyledSliderWrapper } from './Slider.style';
import { SliderThumb } from './SliderThumb';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSliderProps, keyof Props>;

type SliderProps = Props & NativeAttrs & InheritAttrs;

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ className, style, hidden, minValue = 0, maxValue = 100, label, ...props }, ref): JSX.Element => {
    const domRef = useDOMRef(ref);
    const trackRef = useRef<HTMLInputElement>(null);

    const ariaProps = { ...props, minValue, maxValue, label };

    const numberFormatter = useNumberFormatter({});
    const state = useSliderState({
      ...ariaProps,
      numberFormatter
    });

    const { groupProps, trackProps, labelProps } = useSlider(ariaProps, state, trackRef);

    return (
      <StyledSliderWrapper
        {...groupProps}
        direction='column'
        ref={domRef}
        className={className}
        style={style}
        hidden={hidden}
      >
        <Label {...labelProps}>{label}</Label>
        <StyledBaseTrack ref={trackRef} {...trackProps}>
          <SliderThumb index={0} trackRef={trackRef} state={state} />
        </StyledBaseTrack>
      </StyledSliderWrapper>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
