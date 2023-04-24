import { Keyring } from '@polkadot/api';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { useState } from 'react';
import { Trans } from 'react-i18next';

import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P, TextLink } from '@/component-library';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { SS58_FORMAT } from '@/constants';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';
import { WalletData } from '@/utils/constants/wallets';
import { findWallet } from '@/utils/helpers/wallet';

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

type Props = {
  onAccountSelect: (account: KeyringPair) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type AuthModalProps = Props & InheritAttrs;

const AuthModal = ({ onClose, onAccountSelect, ...props }: AuthModalProps): JSX.Element => {
  const { extensions, selectedAccount, accounts } = useSubstrateSecureState();

  const [step, setStep] = useState<AuthModalSteps>(selectedAccount ? AuthModalSteps.ACCOUNT : AuthModalSteps.WALLET);
  const [wallet, setWallet] = useState<WalletData | undefined>(
    selectedAccount?.meta.name ? findWallet(selectedAccount?.meta.source as any) : undefined
  );

  const handleWalletSelect = (wallet: WalletData) => {
    setStep(AuthModalSteps.ACCOUNT);
    setWallet(wallet);
  };

  const handleChangeWallet = () => {
    setStep(AuthModalSteps.WALLET);
    setWallet(undefined);
  };

  const onSelectionChange = (account: InjectedAccountWithMeta) => {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_FORMAT });
    const keyringAccount = keyring.addFromAddress(account.address, account.meta);
    onAccountSelect(keyringAccount as KeyringPair);
    onClose();
  };

  const title = getTitle(step, extensions);

  return (
    <Modal align='top' onClose={onClose} {...props}>
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
        <AccountStep
          step={step}
          wallet={wallet}
          accounts={accounts}
          onSelectionChange={onSelectionChange}
          onChangeWallet={handleChangeWallet}
        />
      </ModalBody>
      {step === AuthModalSteps.ACCOUNT && (
        <ModalFooter>
          <CTA size='large' variant='outlined'>
            Disconnect
          </CTA>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { AuthModal, AuthModalSteps };
export type { AuthModalProps };
