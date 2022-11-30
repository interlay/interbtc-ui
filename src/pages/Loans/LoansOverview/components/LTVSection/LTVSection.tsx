import { formatUSD } from '@/common/utils/utils';
import { Card } from '@/component-library';
import { AccountPositionsStatisticsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { StyledDd, StyledDl, StyledDlGroup, StyledDt, StyledLTVMeter } from './LTVSection.style';

const status = {
  success: 'Low Risk',
  warning: 'Medium Risk',
  error: 'Liquidation Risk'
};

type LTVSectionProps = {
  prices?: Prices;
  statistics: AccountPositionsStatisticsData | undefined;
};

// TODO: dont allow negative balance

const LTVSection = ({ statistics }: LTVSectionProps): JSX.Element => {
  const { data: currentLTV } = useGetLTV();
  const { borrowAmountUSD, collateralizedAmountUSD } = statistics || {};
  const borrowBalanceLabel = formatUSD(borrowAmountUSD?.toNumber() || 0);
  const collateralValueLabel = formatUSD(collateralizedAmountUSD?.toNumber() || 0);

  return (
    <Card direction='column' justifyContent='center' gap='spacing2'>
      <StyledDl justifyContent='center' gap='spacing6'>
        <StyledDlGroup direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
          <StyledDt color='primary'>Borrow Balance</StyledDt>
          <StyledDd color='secondary'>{borrowBalanceLabel}</StyledDd>
        </StyledDlGroup>
        <StyledDlGroup direction='column' gap='spacing1'>
          <StyledDt color='primary'>Collateral Balance</StyledDt>
          <StyledDd color='secondary'>{collateralValueLabel}</StyledDd>
        </StyledDlGroup>
        <StyledDlGroup direction='column' gap='spacing1'>
          <StyledDt color='primary'>Loan Status</StyledDt>
          <StyledDd color='secondary'>{currentLTV?.status ? status[currentLTV.status] : '-'}</StyledDd>
        </StyledDlGroup>
      </StyledDl>
      <StyledLTVMeter value={currentLTV?.value} thresholds={statistics?.thresholds} />
    </Card>
  );
};
export { LTVSection };
export type { LTVSectionProps };
