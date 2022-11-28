import { useMeter as useAriaMeter } from '@react-aria/meter';
import { AriaMeterProps } from '@react-types/meter';

import { MeterRanges } from './Meter';

type UseMeterProps = Omit<AriaMeterProps, 'minValue' | 'maxValue'> & { ranges: MeterRanges };

// TODO: stop exporting hook
const useMeter = ({ ranges, value: valueProp = 0, ...props }: UseMeterProps): ReturnType<typeof useAriaMeter> => {
  const [minRange, , , maxRange] = ranges;

  const isOverMaxValue = valueProp > maxRange;
  const maxValue = isOverMaxValue ? valueProp : maxRange;
  const value = isOverMaxValue ? maxValue : valueProp;

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
