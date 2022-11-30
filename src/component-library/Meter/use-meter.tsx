import { useMeter as useAriaMeter } from '@react-aria/meter';
import { AriaMeterProps } from '@react-types/meter';
import { HTMLAttributes } from 'react';

import { MeterRanges } from './Meter';

interface MeterAria {
  meterProps: Omit<HTMLAttributes<HTMLElement>, 'onChange'>;
  labelProps: HTMLAttributes<HTMLElement>;
}

const getMaxRange = (value: number, maxRange?: number): number => {
  if (!maxRange) return 100;

  const isOverMaxValue = !!maxRange && value > maxRange;
  return isOverMaxValue ? value : maxRange;
};

type UseMeterProps = Omit<AriaMeterProps, 'minValue' | 'maxValue'> & { ranges?: MeterRanges };

const useMeter = ({ ranges, value: valueProp = 0, ...props }: UseMeterProps): MeterAria => {
  const [minRange, , , maxRange] = ranges || [];

  const maxValue = getMaxRange(valueProp, maxRange);

  const value = valueProp > maxValue ? maxValue : valueProp;

  const aria = useAriaMeter({
    minValue: minRange,
    maxValue,
    value,
    ...props
  });

  return aria;
};

export type { UseMeterProps };
export { useMeter };
