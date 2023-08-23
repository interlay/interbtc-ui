import { useNumberFormatter } from '@react-aria/i18n';
import { AriaSliderProps, useSlider } from '@react-aria/slider';
import { useSliderState } from '@react-stately/slider';
import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';

import { Label } from '../Label';
import { useDOMRef } from '../utils/dom';
import { StyledControls, StyledFilledTrack, StyledSliderWrapper, StyledTrack } from './Slider.style';
import { SliderMarks } from './SliderMarks';
import { SliderThumb } from './SliderThumb';

type Props = {
  marks?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  onChange?: (value: number) => void;
  renderMarkText?: (text: ReactNode) => ReactNode;
  value?: number;
  defaultValue?: number;
  step?: number;
};

type InheritAttrs = Omit<AriaSliderProps, keyof Props>;

type NativeAttrs = Omit<InputHTMLAttributes<unknown>, keyof (Props & InheritAttrs)>;

type SliderProps = Props & NativeAttrs & InheritAttrs;

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      style,
      hidden,
      step = 1,
      minValue = 0,
      maxValue = 100,
      label,
      marks,
      onChange,
      renderMarkText,
      name,
      formatOptions,
      isDisabled,
      value,
      defaultValue,
      ...props
    },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);
    const trackRef = useRef<HTMLInputElement>(null);

    const ariaProps: AriaSliderProps = {
      ...props,
      step,
      minValue,
      maxValue,
      label,
      isDisabled,
      value: value ? [value] : undefined,
      defaultValue: defaultValue ? [defaultValue] : undefined,
      onChange: ((value: number[]) => onChange?.(value[0])) as any
    };

    const numberFormatter = useNumberFormatter(formatOptions);
    const state = useSliderState({
      ...ariaProps,

      numberFormatter
    });

    const { groupProps, trackProps, labelProps } = useSlider(ariaProps, state, trackRef);

    return (
      <StyledSliderWrapper
        {...groupProps}
        $isDisabled={isDisabled}
        direction='column'
        ref={domRef}
        className={className}
        style={style}
        hidden={hidden}
      >
        <Label {...labelProps}>{label}</Label>
        <StyledControls ref={trackRef} $hasMarks={!!marks} {...trackProps}>
          <StyledTrack />
          <SliderThumb index={0} trackRef={trackRef} state={state} name={name} />
          <StyledFilledTrack $percentage={state.getThumbPercent(0)} />
          {marks && (
            <SliderMarks
              state={state}
              step={step}
              minValue={minValue}
              maxValue={maxValue}
              numberFormatter={numberFormatter}
              renderMarkText={renderMarkText}
            />
          )}
        </StyledControls>
      </StyledSliderWrapper>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
