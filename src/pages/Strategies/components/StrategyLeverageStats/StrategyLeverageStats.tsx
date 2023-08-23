import { Card, CardProps, Dd, Dt } from '@/component-library';
import {
  LTVMeter,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup
} from '@/components';

import { StyledDivider, StyledDl, StyledDlGroup, StyledStatus } from './StrategyLeverageStats.style';

const status = {
  success: 'Low Risk',
  warning: 'Medium Risk',
  error: 'Liquidation Risk'
};

type StrategyLeverageStatsProps = CardProps;

const StrategyLeverageStats = (props: StrategyLeverageStatsProps): JSX.Element => {
  return (
    <Card direction='column' justifyContent='center' gap='spacing4' {...props}>
      <StyledDl justifyContent='center' gap='spacing6'>
        <StyledDlGroup direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
          <Dt size='s' color='primary' weight='bold'>
            LTV
          </Dt>
          <Dd size='s' color='secondary' weight='bold'>
            44.12%
          </Dd>
        </StyledDlGroup>
        <StyledDivider />
        <StyledDlGroup direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
          <Dt size='s' color='primary' weight='bold'>
            Leverage
          </Dt>
          <Dd size='s' color='secondary' weight='bold'>
            3x
          </Dd>
        </StyledDlGroup>
        <StyledDivider />
        <StyledDlGroup direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
          <Dt size='s' color='primary' weight='bold'>
            Loan Risk
          </Dt>
          <StyledStatus size='s' $status='success' weight='bold'>
            {status.success}
          </StyledStatus>
        </StyledDlGroup>
      </StyledDl>
      <LTVMeter showLegend value={65} ranges={[0, 60, 70, 100]} />
      <TransactionDetails>
        <TransactionDetailsGroup>
          <TransactionDetailsDt>Collateral price</TransactionDetailsDt>
          <TransactionDetailsDd>1 IBTC = $24,231.11</TransactionDetailsDd>
        </TransactionDetailsGroup>
        <TransactionDetailsGroup>
          <TransactionDetailsDt>Liquidation price</TransactionDetailsDt>
          <TransactionDetailsDd>$21,231.11</TransactionDetailsDd>
        </TransactionDetailsGroup>
      </TransactionDetails>
    </Card>
  );
};
export { StrategyLeverageStats };
