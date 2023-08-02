import { useNumberFormatter } from '@react-aria/i18n';
import { AriaSliderProps, useSlider } from '@react-aria/slider';
import { useSliderState } from '@react-stately/slider';
import { forwardRef, Fragment, HTMLAttributes, ReactNode, useMemo, useRef } from 'react';

import { Label } from '../Label';
import { Span } from '../Text';
import { useDOMRef } from '../utils/dom';
import {
  StyledControls,
  StyledFilledTrack,
  StyledMark,
  StyledMarkText,
  StyledSliderWrapper,
  StyledTrack
} from './Slider.style';
import { SliderThumb } from './SliderThumb';

type MarkItem = { label?: ReactNode; value: number };

type Props = { marks?: boolean | MarkItem[] };

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSliderProps, keyof Props>;

type SliderProps = Props & NativeAttrs & InheritAttrs;

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ className, style, hidden, minValue = 0, maxValue = 100, label, marks: marksProp, ...props }, ref): JSX.Element => {
    const domRef = useDOMRef(ref);
    const trackRef = useRef<HTMLInputElement>(null);

    const ariaProps = { ...props, minValue, maxValue, label };

    const numberFormatter = useNumberFormatter({});
    const state = useSliderState({
      ...ariaProps,
      numberFormatter
    });

    const { groupProps, trackProps, labelProps } = useSlider(ariaProps, state, trackRef);

    const marks = useMemo(() => (marksProp ? Array(maxValue).fill(undefined) : []), [marksProp, maxValue]);

    const spacing = 100 / (maxValue - minValue);

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
          {marks.map((_, idx) => {
            const position = 0;

            return (
              <Fragment key={idx}>
                <StyledMark $number={idx} $spacing={spacing} />
                <StyledMarkText size='xs'>{idx}</StyledMarkText>
              </Fragment>
            );
          })}
        </StyledControls>
      </StyledSliderWrapper>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
