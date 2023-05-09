import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { useEffect, useMemo, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';
import { WalletData } from '@/utils/constants/wallets';
import { findWallet } from '@/utils/helpers/wallet';

import { AccountStep } from './AccountStep';
import { Disclaimer } from './Disclaimer';
import { AuthModalSteps } from './types';
import { WalletStep } from './WalletStep';

const getTitle = (t: TFunction, step: AuthModalSteps, extensions: InjectedExtension[]) => {
  if (step === AuthModalSteps.ACCOUNT) {
    return t('account_modal.please_select_an_account');
  }

  if (!extensions.length) {
    return t('account_modal.please_install_supported_wallet');
  }

  return t('account_modal.please_select_a_wallet');
};

type Props = {
  onAccountSelect?: (account: InjectedAccountWithMeta) => void;
  onDisconnect?: () => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type AuthModalProps = Props & InheritAttrs;

const AuthModal = ({ onAccountSelect, onDisconnect, isOpen, ...props }: AuthModalProps): JSX.Element => {
  const { t } = useTranslation();

  const { extensions, selectedAccount, accounts } = useSubstrateSecureState();

  const [step, setStep] = useState<AuthModalSteps>(AuthModalSteps.ACCOUNT);
  const [wallet, setWallet] = useState<WalletData | undefined>();

  useEffect(() => {
    if (!isOpen) return;

    setStep(selectedAccount ? AuthModalSteps.ACCOUNT : AuthModalSteps.WALLET);
    setWallet(undefined);
  }, [isOpen, selectedAccount]);

  const handleWalletSelect = (wallet: WalletData) => {
    setStep(AuthModalSteps.ACCOUNT);
    setWallet(wallet);
  };

  const handleChangeWallet = () => {
    setStep(AuthModalSteps.WALLET);
    setWallet(undefined);
  };

  const handleAccountSelection = (account: InjectedAccountWithMeta) => onAccountSelect?.(account);

  const handleDisconnect = () => onDisconnect?.();

  const currentWallet = useMemo(() => wallet || (selectedAccount && findWallet(selectedAccount?.meta.source)), [
    selectedAccount,
    wallet
  ]);

  const title = getTitle(t, step, extensions);

  const hasDisconnect = step === AuthModalSteps.ACCOUNT && selectedAccount;

  return (
    <Modal align='top' isOpen={isOpen} {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody>
        <Disclaimer />
        <WalletStep
          step={step}
          onSelectionChange={handleWalletSelect}
          extensions={extensions}
          selectedWallet={currentWallet}
        />
        {currentWallet && (
          <AccountStep
            step={step}
            wallet={currentWallet}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelectionChange={handleAccountSelection}
            onChangeWallet={handleChangeWallet}
          />
        )}
      </ModalBody>
      {hasDisconnect && (
        <ModalFooter>
          <CTA size='large' variant='outlined' onPress={handleDisconnect}>
            {t('account_modal.disconnect')}
          </CTA>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { AuthModal, AuthModalSteps };
export type { AuthModalProps };
