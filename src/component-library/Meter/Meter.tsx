import { HTMLAttributes } from 'react';

import { StyledMeter, StyledWrapper } from './Meter.style';

type Props = {
  percentage?: number;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type MeterProps = Props & NativeAttrs;

const getWidth = (percentage: number) => (percentage > 100 ? 100 : percentage < 0 ? 0 : percentage);

const Meter = ({ percentage = 0, ...props }: MeterProps): JSX.Element => (
  <StyledWrapper>
    <StyledMeter $width={getWidth(percentage)} {...props} />
  </StyledWrapper>
);

export { Meter };
export type { MeterProps };
