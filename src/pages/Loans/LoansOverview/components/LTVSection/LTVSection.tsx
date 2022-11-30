import { formatUSD } from '@/common/utils/utils';
import { Card, Dl } from '@/component-library';
import { AccountPositionsStatisticsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { LTVMeter } from '../LTVMeter.tsx';
import { StyledDd, StyledDlGroup, StyledDt } from './LTVSection.style';

type LTVSectionProps = {
  prices?: Prices;
  statistics: AccountPositionsStatisticsData | undefined;
};

const LTVSection = ({ statistics }: LTVSectionProps): JSX.Element => {
  const { borrowAmountUSD, collateralAmountUSD } = statistics || {};
  const borrowBalanceLabel = formatUSD(borrowAmountUSD?.toNumber() || 0);
  const collateralValueLabel = formatUSD(collateralAmountUSD?.toNumber() || 0);

  return (
    <Card direction='column' justifyContent='center' gap='spacing6'>
      <Dl justifyContent='center' gap='spacing6'>
        <StyledDlGroup direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
          <StyledDt color='primary'>Borrow Balance</StyledDt>
          <StyledDd color='secondary'>{borrowBalanceLabel}</StyledDd>
        </StyledDlGroup>
        <StyledDlGroup direction='column' gap='spacing1'>
          <StyledDt color='primary'>Collateral Balance</StyledDt>
          <StyledDd color='secondary'>{collateralValueLabel}</StyledDd>
        </StyledDlGroup>
      </Dl>
      <LTVMeter />
    </Card>
  );
};
export { LTVSection };
export type { LTVSectionProps };
