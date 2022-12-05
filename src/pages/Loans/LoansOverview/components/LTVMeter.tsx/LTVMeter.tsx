import { formatNumber } from '@/common/utils/utils';
import { Flex, Meter, MeterProps, MeterRanges, useMeter, UseMeterProps } from '@/component-library';
import { PositionsThresholdsData } from '@/utils/hooks/api/loans/use-get-account-positions';

import { LTVLegend } from './LTVLegend';

const legendDescriptions = {
  currentLTV: 'Your Current Loan to Value position ratio.',
  maxLTV: 'Max Loan to Value limit - Your Max Borrow position You can borrow up to that ratio.',
  liquidationLTV: 'Loan to Value ratio at which your position gets liquidated.'
};

const getRanges = (thresholds?: PositionsThresholdsData): MeterRanges | undefined => {
  if (!thresholds) return undefined;

  const collateral = formatNumber(thresholds.collateral.toNumber(), { maximumFractionDigits: 2 });
  const liquidation = formatNumber(thresholds.liquidation.toNumber(), { maximumFractionDigits: 2 });

  return [0, Number(collateral), Number(liquidation), 100];
};

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  thresholds?: PositionsThresholdsData;
  onChange?: MeterProps['onChange'];
  className?: string;
  showLegend?: boolean;
};

type InheritAttrs = Omit<UseMeterProps, keyof Props | 'ranges'>;

type LTVMeterProps = Props & InheritAttrs;

const LTVMeter = ({
  label,
  thresholds,
  onChange,
  className,
  value: valueProp,
  showLegend,
  ...props
}: LTVMeterProps): JSX.Element => {
  const ranges = getRanges(thresholds);
  const { meterProps } = useMeter({
    label,
    value: valueProp,
    formatOptions,
    ranges,
    'aria-label': 'ltv meter',
    ...props
  });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;

  // TODO: add tooltips
  return (
    <Flex direction='column' gap='spacing3' className={className}>
      <Meter {...meterProps} variant='secondary' value={value} ranges={ranges} onChange={onChange} />
      {showLegend && (
        <Flex gap='spacing4' justifyContent='center' wrap>
          <LTVLegend label='Current LTV' description={legendDescriptions.currentLTV} status='info' />
          <LTVLegend label='Max LTV' description={legendDescriptions.maxLTV} status='warning' />
          <LTVLegend label='Liquidation LTV' description={legendDescriptions.liquidationLTV} status='error' />
        </Flex>
      )}
    </Flex>
  );
};

export { LTVMeter };
export type { LTVMeterProps };
