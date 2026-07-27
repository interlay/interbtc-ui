import { Flex, H1, P } from '@/component-library';
import { APP_NAME, GovernanceTokenLogoWithTextIcon } from '@/config/relay-chains';

const ServiceHalted = (): JSX.Element => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <Flex direction='column' alignItems='center' gap='spacing8' style={{ maxWidth: '600px', textAlign: 'center' }}>
      <GovernanceTokenLogoWithTextIcon width={200} />
      <Flex direction='column' alignItems='center' gap='spacing4'>
        <H1 size='xl2' weight='bold' align='center'>
          Service Halted
        </H1>
        <P align='center'>
          The {APP_NAME} app is currently offline as coretime for the chain has not been extended. All funds on the
          chain are locked until the chain is restarted. The chain can be restarted following the runbook: [link to
          follow].
        </P>
      </Flex>
    </Flex>
  </div>
);

export default ServiceHalted;
