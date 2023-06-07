import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';

import { Card, Dd, Dl, DlGroup, Dt, Flex, P } from '@/component-library';

type IssueLimitsCardProps = { requestLimits: IssueLimits };

const IssueLimitsCard = ({ requestLimits }: IssueLimitsCardProps): JSX.Element => (
  <Flex direction='column' gap='spacing2'>
    <P size='xs'>Max Issuable</P>
    <Card gap='spacing4' variant='bordered' background='tertiary' rounded='lg' padding='spacing4'>
      <Dl direction='column' gap='spacing2'>
        <DlGroup justifyContent='space-between' flex='1'>
          <Dt size='xs' color='primary'>
            In single request
          </Dt>
          <Dd size='xs'>
            {requestLimits.singleVaultMaxIssuable.toHuman()} {requestLimits.singleVaultMaxIssuable.currency.ticker}
          </Dd>
        </DlGroup>
        <DlGroup justifyContent='space-between' flex='1'>
          <Dt size='xs' color='primary'>
            In total
          </Dt>
          <Dd size='xs'>
            {requestLimits.totalMaxIssuable.toHuman()} {requestLimits.totalMaxIssuable.currency.ticker}
          </Dd>
        </DlGroup>
      </Dl>
    </Card>
  </Flex>
);

export { IssueLimitsCard };
export type { IssueLimitsCardProps };
