import { Flex, H1, P } from '@/component-library';
import { GovernanceTokenLogoWithTextIcon } from '@/config/relay-chains';

const ServiceHalted = (): JSX.Element => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <Flex direction='column' alignItems='center' gap='spacing8' style={{ maxWidth: '600px', textAlign: 'center' }}>
      <GovernanceTokenLogoWithTextIcon width={200} />
      <Flex direction='column' alignItems='center' gap='spacing4'>
        <H1 size='xl2' weight='bold' align='center'>
          Service Halted
        </H1>
        <P align='center'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </P>
      </Flex>
    </Flex>
  </div>
);

export default ServiceHalted;
