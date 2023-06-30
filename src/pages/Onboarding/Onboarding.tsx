import { Keyring } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction, showSignTermsModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { Card, CTA, CTALink, Dd, DlGroup, Dt, Flex } from '@/component-library';
import { AuthModal, SignTermsModal } from '@/components/AuthModal';
import { Tutorial } from '@/components/Tutorial';
import { INTERLAY_DISCORD_LINK } from '@/config/links';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { SS58_FORMAT } from '@/constants';
import { KeyringPair, useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import MainContainer from '@/parts/MainContainer';
import PageTitle from '@/parts/PageTitle';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

import { StyledWrapper } from './Onboarding.style';

type Steps = {
  title: string;
  content: string;
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
  const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  const { selectProps } = useSignMessage();
  const { extensions, selectedAccount } = useSubstrateSecureState();
  const { hasSignature } = useSignMessage();

  const governanceTokenBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);

  const handleAccountModalOpen = () => dispatch(showAccountModalAction(true));

  const handleAccountModalClose = () => dispatch(showAccountModalAction(false));

  const handleAccountSelect = (account: InjectedAccountWithMeta) => {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_FORMAT });
    const keyringAccount = keyring.addFromAddress(account.address, account.meta);
    setSelectedAccount(keyringAccount);
    selectProps.onSelectionChange(keyringAccount as KeyringPair);
    handleAccountModalClose();
  };

  const handleDisconnect = () => {
    removeSelectedAccount();
    handleAccountModalClose();
  };

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
      content: 'If you do not have any INTR, join our Discord and request funds in the #faucet channel.',
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
          <CTA
            onPress={step.onPress}
            variant='primary'
            fullWidth={false}
            disabled={step.isCompleted || !step.isActive}
          >
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
        <PageTitle mainTitle={'Onboarding Tutorial'} />
        {steps.map((step, index) => (
          <Flex key={index} direction='column' gap='spacing4'>
            <Card flex='1'>
              <DlGroup direction='column' alignItems='flex-start' gap='spacing4' marginY='spacing4'>
                <Dt weight='semibold' color='primary'>
                  {step.title}
                </Dt>
                <Dd color='primary'>{step.content}</Dd>
              </DlGroup>
              {getCta(step)}
            </Card>
          </Flex>
        ))}
        <AuthModal
          isOpen={showAccountModal}
          onClose={handleAccountModalClose}
          onDisconnect={handleDisconnect}
          onAccountSelect={handleAccountSelect}
        />
        <SignTermsModal isOpen={isSignTermsModalOpen} onClose={handleCloseSignTermsModal} />
      </StyledWrapper>
    </MainContainer>
  );
};

export default Onboarding;
