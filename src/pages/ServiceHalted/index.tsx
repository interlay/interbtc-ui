import { Flex, H1, P, TextLink } from '@/component-library';
import { GovernanceTokenLogoWithTextIcon } from '@/config/relay-chains';

const SHUTDOWN_ANNOUNCEMENT_LINK = 'https://x.com/InterlayHQ/status/2065344161788670027';

const ServiceHalted = (): JSX.Element => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <Flex direction='column' alignItems='center' gap='spacing8' style={{ maxWidth: '600px', textAlign: 'center' }}>
      <GovernanceTokenLogoWithTextIcon width={200} />
      <Flex direction='column' alignItems='center' gap='spacing4'>
        <H1 size='xl2' weight='bold' align='center'>
          Service Halted
        </H1>
        <P align='center'>
          The Interlay and Kintsugi networks have been wound down and this app is no longer operational. INTR and KINT
          are native tokens and could never be withdrawn; they remain on their chains. All code is open source and
          governance lives on-chain, so the community can restart the networks using the published runbook.
        </P>
        <P align='center'>
          The mission continues at BOB, where Bitcoin DeFi is finding real traction. Read the full announcement and FAQ:{' '}
          <TextLink external to={SHUTDOWN_ANNOUNCEMENT_LINK} underlined>
            Closing a Chapter: Winding Down Interlay and Kintsugi
          </TextLink>
          .
        </P>
      </Flex>
    </Flex>
  </div>
);

export default ServiceHalted;
