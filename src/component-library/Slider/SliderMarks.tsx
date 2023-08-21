import { AriaSliderProps } from '@react-aria/slider';
import { SliderState } from '@react-stately/slider';
import { Fragment, ReactNode, useMemo } from 'react';

import { StyledMark, StyledMarkText } from './Slider.style';

type Props = {
  renderMarkText?: (text: ReactNode) => ReactNode;
  state: SliderState;
  numberFormatter: Intl.NumberFormat;
};

type InheritAttrs = Omit<Pick<AriaSliderProps, 'minValue' | 'maxValue' | 'step'>, keyof Props>;

type SliderMarksProps = Props & InheritAttrs;

const SliderMarks = ({
  step = 1,
  minValue = 0,
  maxValue = 100,
  state,
  numberFormatter,
  renderMarkText = (text) => text
}: SliderMarksProps): JSX.Element => {
  const thumbPercent = state.getThumbPercent(0);

  const { marks } = useMemo(() => {
    const range = maxValue - minValue;

    const numSteps = Math.ceil(range / step);

    return {
      range,
      marks: Array(numSteps + 1)
        .fill(undefined)
        .map((_, idx) => {
          const value = minValue + idx * step;
          const percentage = ((value - minValue) / range) * 100;
          const formattedValue = numberFormatter.format(value);

          return { label: renderMarkText(formattedValue), percentage };
        })
    };
  }, [maxValue, minValue, renderMarkText, numberFormatter, step]);

  return (
    <>
      {marks.map((mark, idx) => {
        const isFilled = thumbPercent * 100 >= mark.percentage;

        return (
          <Fragment key={idx}>
            <StyledMark $position={mark.percentage} $isFilled={isFilled} />
            <StyledMarkText $position={mark.percentage} size='xs'>
              {mark.label}
            </StyledMarkText>
          </Fragment>
        );
      })}
    </>
  );
};

export { SliderMarks };
export type { SliderMarksProps };
