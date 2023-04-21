import { InjectedExtension } from '@polkadot/extension-inject/types';
import { useState } from 'react';
import { Trans } from 'react-i18next';

import { Modal, ModalBody, ModalHeader, ModalProps, P, TextLink } from '@/component-library';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { useSubstrateSecureState } from '@/lib/substrate';
import { WalletData } from '@/utils/constants/wallets';

import { AccountStep } from './AccountStep';
import { WalletStep } from './WalletStep';

const getTitle = (step: AuthModalSteps, extensions: InjectedExtension[]) => {
  if (step === AuthModalSteps.ACCOUNT) {
    return 'Please select an account';
  }

  if (!extensions.length) {
    return 'Please install supported wallet';
  }

  return 'Please select a wallet';
};

enum AuthModalSteps {
  ACCOUNT,
  WALLET
}

type InheritAttrs = Omit<ModalProps, 'children'>;

type AuthModalProps = InheritAttrs;

const AuthModal = (props: AuthModalProps): JSX.Element => {
  const { extensions, selectedAccount, accounts } = useSubstrateSecureState();

  const [step, setStep] = useState<AuthModalSteps>(AuthModalSteps.WALLET);
  const [wallet, setWallet] = useState<WalletData>();

  const handleWalletSelect = (wallet: WalletData) => {
    setStep(AuthModalSteps.ACCOUNT);
    setWallet(wallet);
  };

  const handleChangeWallet = () => {
    setStep(AuthModalSteps.WALLET);
    setWallet(undefined);
  };

  const title = getTitle(step, extensions);

  return (
    <Modal align='top' {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody>
        <P size='s'>
          <Trans i18nKey='exclude_us_citizens'>
            By proceeding you confirm that you have read and accepted the{' '}
            <TextLink external to={TERMS_AND_CONDITIONS_LINK} underlined>
              terms and conditions
            </TextLink>
            , and represent and warrant that you are not a Resident of the United States or a &quot;U.S. person&quot;
            within the meaning of Rule 902(k) under the United States Securities Act of 1933 (the &quot;Securities
            Act&quot;).
          </Trans>
        </P>
        <WalletStep
          step={step}
          onSelectionChange={handleWalletSelect}
          extensions={extensions}
          selectedAccount={selectedAccount}
        />
        <AccountStep step={step} wallet={wallet} accounts={accounts} onChangeWallet={handleChangeWallet} />
      </ModalBody>
    </Modal>
  );
};

export { AuthModal, AuthModalSteps };
export type { AuthModalProps };
