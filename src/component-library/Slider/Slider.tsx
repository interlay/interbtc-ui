import { useNumberFormatter } from '@react-aria/i18n';
import { AriaSliderProps, useSlider } from '@react-aria/slider';
import { useSliderState } from '@react-stately/slider';
import { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react';

import { Label } from '../Label';
import { useDOMRef } from '../utils/dom';
import { StyledControls, StyledFilledTrack, StyledSliderWrapper, StyledTrack } from './Slider.style';
import { SliderMarks } from './SliderMarks';
import { SliderThumb } from './SliderThumb';

type MarkItem = { label?: ReactNode; value: number };

type Props = { marks?: boolean | MarkItem[] };

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSliderProps, keyof Props>;

type SliderProps = Props & NativeAttrs & InheritAttrs;

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ className, style, hidden, minValue = 0, maxValue = 100, label, marks, step = 1, ...props }, ref): JSX.Element => {
    const domRef = useDOMRef(ref);
    const trackRef = useRef<HTMLInputElement>(null);

    const ariaProps = { ...props, step, minValue, maxValue, label };

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
        <StyledControls ref={trackRef} {...trackProps}>
          <StyledTrack />
          <SliderThumb index={0} trackRef={trackRef} state={state} />
          <StyledFilledTrack $percentage={state.getThumbPercent(0)} />
          {marks && <SliderMarks state={state} marks={marks} step={step} minValue={minValue} maxValue={maxValue} />}
        </StyledControls>
      </StyledSliderWrapper>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
