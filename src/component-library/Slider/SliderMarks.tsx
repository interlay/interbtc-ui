import { AriaSliderProps } from '@react-aria/slider';
import { SliderState } from '@react-stately/slider';
import { Fragment, ReactNode, useMemo } from 'react';

import { StyledMark, StyledMarkText } from './Slider.style';

type MarkItem = { label?: ReactNode; value: number };

type Props = { marks?: boolean | MarkItem[]; state: SliderState };

type InheritAttrs = Omit<Pick<AriaSliderProps, 'minValue' | 'maxValue' | 'step'>, keyof Props>;

type SliderMarksProps = Props & InheritAttrs;

const SliderMarks = ({
  minValue = 0,
  maxValue = 100,
  marks: marksProp,
  step = 1,
  state
}: SliderMarksProps): JSX.Element => {
  // Calculate the range of values
  const range = maxValue - minValue;

  // Calculate the number of steps
  const numSteps = Math.ceil(range / step);

  const marks = useMemo(() => (marksProp ? Array(numSteps + 1).fill(undefined) : []), [marksProp, numSteps]);

  const thumbPercent = state.getThumbPercent(0);

  return (
    <>
      {marks.map((_, idx) => {
        const markValue = minValue + idx * (range / numSteps);
        const markPercentage = ((markValue - minValue) / range) * 100;
        const isFilled = thumbPercent * 100 >= markPercentage;
        return (
          <Fragment key={idx}>
            <StyledMark $position={markPercentage} $isFilled={isFilled} />
            <StyledMarkText $position={markPercentage} size='xs'>
              {idx + 1}
            </StyledMarkText>
          </Fragment>
        );
      })}
    </>
  );
};

export { SliderMarks };
export type { SliderMarksProps };
