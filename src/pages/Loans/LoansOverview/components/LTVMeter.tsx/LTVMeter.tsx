import { Flex, Meter, MeterProps, useMeter, UseMeterProps } from '@/component-library';

import { LTVLegend } from './LTVLegend';

const legendDescriptions = {
  currentLTV: 'Represents your current Loan-to-value position.',
  secureLTV: 'You can borrow until you reach this threshold, but exceeding it poses high risk of liquidation.',
  liquidationLTV: 'Your collateral will get liquidated if your LTV reaches this threshold.'
};

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  onChange?: MeterProps['onChange'];
  className?: string;
  showLegend?: boolean;
};

type InheritAttrs = Omit<UseMeterProps, keyof Props>;

type LTVMeterProps = Props & InheritAttrs;

const LTVMeter = ({
  label,
  ranges,
  onChange,
  className,
  value: valueProp,
  showLegend,
  ...props
}: LTVMeterProps): JSX.Element => {
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

  return (
    <Flex direction='column' gap='spacing3' className={className}>
      <Meter {...meterProps} variant='secondary' value={value} ranges={ranges} onChange={onChange} />
      {showLegend && (
        <Flex gap='spacing4' justifyContent='center' wrap>
          <LTVLegend label='Current LTV' description={legendDescriptions.currentLTV} status='info' />
          <LTVLegend label='Secure LTV' description={legendDescriptions.secureLTV} status='warning' />
          <LTVLegend label='Liquidation LTV' description={legendDescriptions.liquidationLTV} status='error' />
        </Flex>
      )}
    </Flex>
  );
};

export { LTVMeter };
export type { LTVMeterProps };
