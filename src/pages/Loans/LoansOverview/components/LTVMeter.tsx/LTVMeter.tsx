import { formatNumber } from '@/common/utils/utils';
import { Flex, Meter, MeterRanges, useMeter, UseMeterProps } from '@/component-library';
import { PositionsThresholdsData } from '@/utils/hooks/api/loans/use-get-account-positions';

import { LTVLegend } from './LTVLegend';

const getRanges = (thresholds?: PositionsThresholdsData): MeterRanges | undefined => {
  if (!thresholds) return undefined;

  const collateral = formatNumber(thresholds.collateral.toNumber(), { maximumFractionDigits: 2 });
  const liquidation = formatNumber(thresholds.liquidation.toNumber(), { maximumFractionDigits: 2 });

  return [0, Number(collateral), Number(liquidation), 100];
};

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  thresholds?: PositionsThresholdsData;
};

type InheritAttrs = Omit<UseMeterProps, keyof Props | 'ranges' | 'value'>;

type LTVMeterProps = Props & InheritAttrs;

const LTVMeter = ({ label, thresholds, ...props }: LTVMeterProps): JSX.Element => {
  const ranges = getRanges(thresholds);
  const { meterProps } = useMeter({ label, value: 0, formatOptions, ranges, ...props });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;

  // TODO: add tooltips
  return (
    <Flex>
      <Meter variant='secondary' value={value} ranges={ranges} />
      <Flex gap='spacing2'>
        <LTVLegend label='Current LTV' description='Current LTV' status='info' />
        <LTVLegend label='Max LTV' description='Max LTV' status='warning' />
        <LTVLegend label='Liquidation LTV' description='Liquidation LTV' status='error' />
      </Flex>
    </Flex>
  );
};

export { LTVMeter };
export type { LTVMeterProps };
