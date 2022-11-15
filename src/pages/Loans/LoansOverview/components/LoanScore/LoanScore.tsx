import { formatNumber } from '@/common/utils/utils';
import { MeterRanges, Stack, useMeter, UseMeterProps } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

import { StyledMeter, StyledMeterScore, StyledMeterWrapper } from './LoanScore.style';

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  score?: number;
  label?: string;
  displayScore?: boolean;
  ranges: Record<Status, number>;
};

type InheritAttrs = Omit<UseMeterProps, keyof Props>;

type LoanScoreProps = Props & InheritAttrs;

const LoanScore = ({ score = 0, displayScore, label, ranges, ...props }: LoanScoreProps): JSX.Element => {
  const meterRanges: MeterRanges = [0, ranges.error, ranges.warning, ranges.success];
  const { labelProps, meterProps } = useMeter({ label, value: score, formatOptions, ranges: meterRanges, ...props });

  const isOverMaxValue = score > 10;

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;

  return (
    <Stack {...meterProps}>
      {label && <span {...labelProps}>{label}</span>}
      <StyledMeterWrapper>
        {displayScore && (
          <StyledMeterScore>{isOverMaxValue ? '10+' : formatNumber(value, formatOptions)}</StyledMeterScore>
        )}
        <StyledMeter showRanges value={value} ranges={meterRanges} />
      </StyledMeterWrapper>
    </Stack>
  );
};

export { LoanScore };
export type { LoanScoreProps };
