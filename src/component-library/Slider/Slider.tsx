import { useNumberFormatter } from '@react-aria/i18n';
import { AriaSliderProps, useSlider } from '@react-aria/slider';
import { useSliderState } from '@react-stately/slider';
import { forwardRef, HTMLAttributes, useRef } from 'react';

import { Label } from '../Label';
import { useDOMRef } from '../utils/dom';
import { StyledSliderWrapper, StyledTrack } from './Slider.style';
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
    const numberFormatter = useNumberFormatter({});

    const state = useSliderState({
      ...props,
      numberFormatter,
      minValue,
      maxValue
    });

    const { groupProps, trackProps, labelProps } = useSlider(props, state, trackRef);

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
        <StyledTrack ref={trackRef} {...trackProps}>
          <SliderThumb index={0} trackRef={trackRef} state={state} />
        </StyledTrack>
      </StyledSliderWrapper>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
