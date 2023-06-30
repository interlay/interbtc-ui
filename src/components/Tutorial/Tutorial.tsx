import { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import { CTA, theme } from '@/component-library';

type Props = {
  disabled?: boolean;
  label?: string;
}

type TutorialProps = Props;

const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome to the Interlay app!',
    content: 'Step through this tutorial to understand the different parts of the app.',
  },
  {
    target: '[href="/wallet"]',
    title: 'Wallet',
    content: 'You can find an overview of your assets and positions in the DeFi hub on the wallet page.',
  },
  {
    target: '[href="/bridge"]',
    title: 'IBTC',
    content: 'On the IBTC page you can bridge BTC from and to Interlay.'
  },
  {
    target: '[href="/transfer"]',
    title: 'Transfer and Bridge',
    content: 'You can transfer assets on Interlay and you can also...'
  },
  {
    target: '[href="/transfer"]',
    title: 'Transfer and Bridge',
    content: '...bridge assets from other chains like Polkadot, Polkadot Asset Hub, Astar, HydraDX, and many more from and to Interlay.'
  },
  {
    target: '[href="/lending"]',
    title: 'Lending',
    content: 'Onwards to DeFi! On the lending page you can lend IBTC, DOT, USDT and others to earn interest.'
  },
  {
    target: '[href="/lending"]',
    title: 'Lending',
    content: 'You can also borrow assets like IBTC, DOT, USDT and others.',
  },
  {
    target: '[href="/swap"]',
    title: 'Swap',
    content: 'On the swap page you can swap assets like IBTC, DOT, USDT and others.',
  },
  {
    target: '[href="/pools"]',
    title: 'Pools',
    content: 'On the pools page you can provide liquidity to earn rewards.',
  },
  {
    target: '[href="/staking"]',
    title: 'Staking',
    content: 'Here you can stake INTR to enable you to participate in Interlay governance.',
  },
  {
    target: '[data-key="info"]',
    title: 'Onboarding',
    content: 'All done! You can always redo this tutorial under "More" and "Onboarding".',
  },
  {
    target: '[href="/wallet"]',
    title: 'Wallet',
    content: 'As a first step, click on the wallet page and check the guide to get assets onto Interlay to join the DeFi hub.',
    disableOverlayClose: true,
    hideCloseButton: true,
    hideFooter: true,
    spotlightClicks: true,
  },
];

const Tutorial = ({
  disabled = false,
  label = 'Start Tutorial',
}: TutorialProps): JSX.Element => {
  const [run, setRun] = useState(false);

  const handleStartTutorial = () => {
    console.log('Starting tutorial...');
    setRun(true);
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status as string) || (action === 'close')) {
      setRun(false);
    }
  };

  return (
    <>
      <CTA
        onPress={handleStartTutorial}
        variant='primary'
        disabled={disabled}
        id='start-tutorial'
      >
        {label}
      </CTA>
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={steps}
        run={run}
        styles={{
          options: {
            primaryColor: theme.cta.primary.bg,
          }
        }}
      />
    </>
  );
};

export { Tutorial };
export type { TutorialProps };