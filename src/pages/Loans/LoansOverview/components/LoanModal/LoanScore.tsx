import { formatNumber } from '@/common/utils/utils';
import { MeterRanges, Stack, useMeter } from '@/component-library';

import { StyledMeter, StyledMeterScore, StyledMeterWrapper } from './LoanModal.style';

const ranges: MeterRanges = [0, 3.3, 6.6, 10];

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type LoanScoreProps = {
  score?: number;
};

const LoanScore = ({ score = 0 }: LoanScoreProps): JSX.Element => {
  const label = 'New Loan Status';
  const { labelProps, meterProps } = useMeter({ label, value: score, formatOptions, ranges });

  const isOverMaxValue = score > 10;

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;

  return (
    <Stack {...meterProps}>
      <span {...labelProps}>{label}</span>
      <StyledMeterWrapper>
        <StyledMeterScore>{isOverMaxValue ? '10+' : formatNumber(value, formatOptions)}</StyledMeterScore>
        <StyledMeter value={value} ranges={ranges} />
      </StyledMeterWrapper>
    </Stack>
  );
};

export { LoanScore };
export type { LoanScoreProps };
