import { formatUSD } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt, Flex, Meter, P } from '@/component-library';
import { AccountPositionsStatisticsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { Prices } from '@/utils/hooks/api/use-get-prices';

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
        <DlGroup>
          <Dt>Borrow Balance</Dt>
          <Dd>{borrowBalanceLabel}</Dd>
        </DlGroup>
        <DlGroup>
          <Dt>Collateral Value</Dt>
          <Dd>{collateralValueLabel}</Dd>
        </DlGroup>
      </Dl>
      <Meter variant='secondary' value={ltv} ranges={[0, 86, 95, 100]} />
      <Flex>
        <P>Current LTV</P>
        <P>Max LTV</P>
        <P>Liquidation Limit</P>
      </Flex>
    </Card>
  );
};
export { LTVSection };
export type { LTVSectionProps };
