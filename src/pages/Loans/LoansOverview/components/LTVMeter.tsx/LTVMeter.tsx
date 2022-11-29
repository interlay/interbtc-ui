import { Flex, Meter, MeterRanges, useMeter, UseMeterProps } from '@/component-library';
import { PositionsThresholdsData, useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';

import { healthFactorRanges } from '../../hooks/use-get-account-health-factor';
import { LTVLegend } from './LTVLegend';

const getLTVMeterPositions = () => 

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  thresholds?: PositionsThresholdsData;
}

type InheritAttrs = Omit<UseMeterProps, keyof Props | 'ranges'>

type LTVMeterProps = Props & InheritAttrs;

const LTVMeter = ({ label, thresholds, ...props }: LTVMeterProps): JSX.Element => {
  const {  meterProps } = useMeter({ label, value, formatOptions, ranges: meterRanges, ...props });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;


  // TODO: add tooltips
  return (
    <Flex>
      <Meter variant='secondary' value={value} ranges={[0, 86, 95, 100]} />
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
