import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction, showSignTermsModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { Card, CTA, CTALink, Flex, H1, H2, P, Strong } from '@/component-library';
import { AuthModal, MainContainer, SignTermsModal } from '@/components';
import { INTERLAY_DISCORD_LINK } from '@/config/links';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useSignMessage } from '@/hooks/use-sign-message';
import { useSubstrateSecureState } from '@/lib/substrate';

import { Tutorial } from './components';
import { StyledWrapper } from './Onboarding.style';

type Steps = {
  title: string;
  content: ReactNode;
  ctaType: typeof CTA | typeof CTALink | typeof Tutorial;
  ctaText: string;
  isCompleted: boolean;
  isActive: boolean;
  onPress?: () => void;
  to?: string;
};

const Onboarding = (): JSX.Element => {
  const { showAccountModal, isSignTermsModalOpen } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  // const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  // const { selectProps } = useSignMessage();
  const { extensions, selectedAccount } = useSubstrateSecureState();
  const { hasSignature } = useSignMessage();

  const governanceTokenBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);

  const handleAccountModalOpen = () => dispatch(showAccountModalAction(true));

  const handleAccountModalClose = () => dispatch(showAccountModalAction(false));

  // const handleAccountSelect = (account: InjectedAccountWithMeta) => {
  //   const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_FORMAT });
  //   const keyringAccount = keyring.addFromAddress(account.address, account.meta);
  //   setSelectedAccount(keyringAccount);
  //   // selectProps.onSelectionChange(keyringAccount as KeyringPair);
  //   handleAccountModalClose();
  // };

  // const handleDisconnect = () => {
  //   removeSelectedAccount();
  //   handleAccountModalClose();
  // };

  const handleCloseSignTermsModal = () => dispatch(showSignTermsModalAction(false));

  const steps: Steps[] = [
    {
      title: 'Install a Wallet',
      content:
        'Click this button to get a selection of wallets. We recommend installing Talisman or SubWallet for ease of use.',
      ctaType: CTA,
      ctaText: t('install_wallet'),
      onPress: handleAccountModalOpen,
      isCompleted: extensions.length > 0,
      isActive: extensions.length === 0
    },
    {
      title: 'Connect the Wallet',
      content: 'After installing a wallet, click this button to connect your wallet.',
      ctaType: CTA,
      ctaText: t('connect_wallet'),
      onPress: handleAccountModalOpen,
      isCompleted: selectedAccount !== undefined,
      isActive: extensions.length > 0
    },
    {
      title: 'Sign the T&Cs',
      content: 'Click this button to sign the T&Cs.',
      ctaType: CTA,
      ctaText: t('sign_t&cs'),
      onPress: () => dispatch(showSignTermsModalAction(true)),
      isCompleted: hasSignature ? true : false,
      isActive: selectedAccount !== undefined
    },
    {
      title: 'Request Funds',
      content: (
        <>
          If you do not have any INTR, join our Discord and request funds in the <Strong>#faucet</Strong> channel.
        </>
      ),
      ctaType: CTALink,
      ctaText: `${t('faq.join_discord')} and ${t('fund_wallet')}`,
      to: INTERLAY_DISCORD_LINK,
      isCompleted: (() => {
        if (governanceTokenBalance) {
          return governanceTokenBalance.isZero() ? false : true;
        }
        return false;
      })(),
      isActive: hasSignature ? true : false
    },
    {
      title: 'Explore the App',
      content: 'Click this button for a guided tour through the app.',
      ctaType: Tutorial,
      ctaText: 'Start Tutorial',
      isCompleted: false,
      isActive: selectedAccount !== undefined
    }
  ];

  const getCta = (step: Steps) => {
    const getCtaLabel = (step: Steps) => {
      const completed = ' ✅';
      const pending = ' ⏳';

      if (step.isCompleted) {
        return step.ctaText.concat(completed);
      } else {
        return step.ctaText.concat(pending);
      }
    };

    switch (step.ctaType) {
      case CTA:
        return (
          <CTA onPress={step.onPress} variant='primary' fullWidth={false} disabled={step.isCompleted || !step.isActive}>
            {getCtaLabel(step)}
          </CTA>
        );
      case CTALink:
        return (
          <CTALink
            external
            to={step.to ? step.to : '/'}
            variant='primary'
            fullWidth={false}
            disabled={step.isCompleted || !step.isActive}
          >
            {getCtaLabel(step)}
          </CTALink>
        );
      case Tutorial:
        return <Tutorial disabled={!step.isActive} label={step.ctaText} />;
      default:
        return null;
    }
  };

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing4'>
        <H1 weight='bold' align='center' size='xl3'>
          Onboarding Tutorial
        </H1>
        {steps.map((step, index) => (
          <Card key={index} flex='1' gap='spacing4' justifyContent='space-between'>
            <Flex direction='column' gap='spacing2'>
              <H2 size='lg' weight='semibold'>
                {step.title}
              </H2>
              <P size='s' color='primary'>
                {step.content}
              </P>
            </Flex>
            {getCta(step)}
          </Card>
        ))}
        <AuthModal isOpen={showAccountModal} onClose={handleAccountModalClose} />
        <SignTermsModal isOpen={isSignTermsModalOpen} onClose={handleCloseSignTermsModal} />
      </StyledWrapper>
    </MainContainer>
  );
};

export default Onboarding;
