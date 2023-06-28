import { Keyring } from "@polkadot/api";
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { showAccountModalAction, showSignTermsModalAction } from "@/common/actions/general.actions";
import { StoreType } from "@/common/types/util.types";
import { Card, CTA, CTALink, Dd, DlGroup, Dt, Flex } from "@/component-library";
import { AuthCTA } from "@/components";
import { AuthModal, SignTermsModal } from "@/components/AuthModal";
import { ACCOUNT_ID_TYPE_NAME } from "@/config/general";
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from "@/config/relay-chains";
import { SS58_FORMAT } from "@/constants";
import { KeyringPair, useSubstrate, useSubstrateSecureState } from "@/lib/substrate";
import MainContainer from "@/parts/MainContainer";
import PageTitle from "@/parts/PageTitle";
import { PAGES } from "@/utils/constants/links";
import { useGetBalances } from "@/utils/hooks/api/tokens/use-get-balances";
import { useSignMessage } from "@/utils/hooks/use-sign-message";

type Steps = {
  title: string;
  content: string;
  ctaType: typeof CTA | typeof AuthCTA | typeof CTALink;
  ctaText: string;
  isCompleted: boolean;
  isNext?: boolean;
  onPress?: () => void;
  url?: string;
}

const Onboarding = (): JSX.Element => {
  const { bridgeLoaded, showAccountModal, isSignTermsModalOpen } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  const { selectProps } = useSignMessage();
  const { extensions, selectedAccount } = useSubstrateSecureState();
  const { hasSignature } = useSignMessage();

  // const [stepIndex, setStepIndex] = React.useState(0);
  const [isRequestPending, setIsRequestPending] = React.useState(false);

  const governanceTokenBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);
  const wrappedTokenBalance = getAvailableBalance(WRAPPED_TOKEN.ticker);


  const handleRequestFromFaucet = async (): Promise<void> => {
    if (!selectedAccount) return;

    try {
      const receiverId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, selectedAccount.address);
      await window.faucet.fundAccount(receiverId, GOVERNANCE_TOKEN);
      // TODO: show new notification
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
    }
  };

  const handleFundsRequest = async () => {
    if (!bridgeLoaded) return;
    setIsRequestPending(true);
    try {
      await handleRequestFromFaucet();
    } catch (error) {
      console.log('[requestFunds] error.message => ', error.message);
    }
    setIsRequestPending(false);
  };

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
      content: 'Click this button to get a selection of wallets. We recommend installing Talisman or SubWallet for ease of use.',
      ctaType: CTA,
      ctaText: t('install_wallet'),
      onPress: handleAccountModalOpen,
      isCompleted: extensions.length > 0,
      isNext: extensions.length === 0,
    },
    {
      title: 'Connect the Wallet',
      content: 'After installing a wallet, click this button to connect your wallet.',
      ctaType: CTA,
      ctaText: t('connect_wallet'),
      onPress: handleAccountModalOpen,
      isCompleted: selectedAccount !== undefined,
      isNext: extensions.length > 0,
    },
    {
      title: 'Sign the T&Cs',
      content: 'Click this button to sign the T&Cs.',
      ctaType: CTA,
      ctaText: t('sign_t&cs'),
      onPress: () => dispatch(showSignTermsModalAction(true)),
      isCompleted: hasSignature? true : false,
      isNext: selectedAccount !== undefined,
    },
    {
      title: 'Request Funds',
      content: 'Click this button to request funds from the faucet.',
      ctaType: AuthCTA,
      ctaText: t('request_funds'),
      onPress: handleFundsRequest,
      isCompleted: (() => {
        if (governanceTokenBalance) {
          return governanceTokenBalance.isZero() ? false : true;
        }
        return false;
      })(),
      isNext: hasSignature? true : false,
    },
    {
      title: 'Transfer INTR',
      content: 'Click this link to open a new window and transfer INTR to another account.',
      ctaType: CTALink,
      ctaText: t('nav_transfer'),
      url: PAGES.TRANSFER,
      isCompleted: false,
      isNext: false,
    },
    {
      title: 'Get iBTC',
      content: 'Click this link to open a new window and get iBTC.',
      ctaType: CTALink,
      ctaText: t('nav_bridge'),
      url: PAGES.BRIDGE,
      isCompleted: (() => {
        if (wrappedTokenBalance) {
          return wrappedTokenBalance.isZero() ? false : true;
        }
        return false;
      })(),
      isNext: false,
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
            disabled={isRequestPending || step.isCompleted || !step.isNext}
          >
            {getCtaLabel(step)}
          </CTA>
        );
      case AuthCTA:
        return (
          <AuthCTA
            onPress={step.onPress}
            variant='primary'
            disabled={isRequestPending || step.isCompleted || !step.isNext}
          >
            {getCtaLabel(step)}
          </AuthCTA>
        );
      case CTALink:
        return (
          <CTALink
            to={step.url? step.url : ''}
            variant='primary'
            disabled={step.isCompleted || !step.isNext}
          >
            {getCtaLabel(step)}
          </CTALink>
        );
      default:
        return null;
    }
  };

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing4'>
        <PageTitle mainTitle={'Onboarding Tutorial'} />
        {steps.map((step, index) => (
          <Flex key={index} direction='column' gap='spacing4'>
            <Card flex='1'>
              <DlGroup direction='column' alignItems='flex-start' gap='spacing4'>
                <Dt weight='semibold' color='primary'>
                  {step.title}
                </Dt>
                <Dd color='primary'>
                  {step.content}
                </Dd>
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
      </Flex>
    </MainContainer>
  );
};

export default Onboarding;