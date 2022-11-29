import { formatUSD } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt, Flex, Meter } from '@/component-library';
import { AccountPositionsStatisticsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { LTVLegend } from '../LTVMeter.tsx/LTVLegend';
import { StyledDlGroup } from './LTVSection.style';

type LTVSectionProps = {
  prices?: Prices;
  statistics: AccountPositionsStatisticsData | undefined;
};

const LTVSection = ({ statistics }: LTVSectionProps): JSX.Element => {
  const { borrowAmountUSD, collateralAmountUSD } = statistics || {};
  const borrowBalanceLabel = formatUSD(borrowAmountUSD?.toNumber() || 0);
  const collateralValueLabel = formatUSD(collateralAmountUSD?.toNumber() || 0);
  const ltv = 0;

  return (
    <Card direction='column' justifyContent='center' alignItems='center'>
      <Dl>
        <StyledDlGroup>
          <Dt>Borrow Balance</Dt>
          <Dd>{borrowBalanceLabel}</Dd>
        </StyledDlGroup>
        <DlGroup>
          <Dt>Collateral Value</Dt>
          <Dd>{collateralValueLabel}</Dd>
        </DlGroup>
      </Dl>
      <Meter variant='secondary' value={ltv} ranges={[0, 86, 95, 100]} />
      <Flex gap='spacing2'>
        <LTVLegend label='Current LTV' description='Current LTV' status='info' />
        <LTVLegend label='Max LTV' description='Max LTV' status='warning' />
        <LTVLegend label='Liquidation LTV' description='Liquidation LTV' status='error' />
      </Flex>
    </Card>
  );
};
export { LTVSection };
export type { LTVSectionProps };
