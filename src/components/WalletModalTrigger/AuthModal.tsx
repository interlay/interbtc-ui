import { useCallback, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@/component-library';
import { useSignMessage } from '@/hooks/use-sign-message';
import { WalletAccountData, WalletData } from '@/lib/wallet/types';
import { useEnableWallet } from '@/lib/wallet/use-enable-wallet';
import { useGetWalletAccounts } from '@/lib/wallet/use-get-wallet-accounts';
import { useGetWallets } from '@/lib/wallet/use-get-wallets';
import { useWallet } from '@/lib/wallet/WalletProvider';

import { AccountStep } from './AccountStep';
import { Disclaimer } from './Disclaimer';
import { AuthModalSteps } from './types';
import { WalletStep } from './WalletStep';

const getTitle = (t: TFunction, step: AuthModalSteps, hasNoInstalledWallet: boolean) => {
  if (step === AuthModalSteps.ACCOUNT) {
    return t('account_modal.please_select_an_account');
  }

  if (hasNoInstalledWallet) {
    return t('account_modal.please_install_supported_wallet');
  }

  return t('account_modal.please_select_a_wallet');
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type AuthModalProps = InheritAttrs;

// TODO: handle better
const AuthModal = ({ isOpen, onClose, ...props }: AuthModalProps): JSX.Element => {
  const { t } = useTranslation();

  const { account, setAccount, disconnect } = useWallet();

  const { data: wallets } = useGetWallets();

  const { selectProps } = useSignMessage();

  const [step, setStep] = useState<AuthModalSteps>(AuthModalSteps.ACCOUNT);
  const [wallet, setWallet] = useState<WalletData | undefined>();

  const { mutateAsync: enableWalletAsync } = useEnableWallet(wallet?.extensionName);

  const { data: accounts, mutateAsync: mutateAccountsAsync } = useGetWalletAccounts(wallet?.extensionName);

  const handleWalletSelect = useCallback(
    async (wallet: WalletData) => {
      setWallet(wallet);
      await enableWalletAsync(wallet);
      await mutateAccountsAsync(wallet);
    },
    [enableWalletAsync, mutateAccountsAsync]
  );

  useEffect(() => {
    if (!isOpen) return;

    setStep(account ? AuthModalSteps.ACCOUNT : AuthModalSteps.WALLET);
    setWallet(account?.wallet);
  }, [isOpen, account]);

  useEffect(() => {
    if (!isOpen || !wallet) return;

    handleWalletSelect(wallet);
  }, [isOpen, wallet, handleWalletSelect]);

  useEffect(() => {
    if (!accounts) return;

    setStep(AuthModalSteps.ACCOUNT);
  }, [accounts]);

  const handleChangeWallet = () => {
    setStep(AuthModalSteps.WALLET);
  };

  const handleAccountSelection = (account: WalletAccountData) => {
    setAccount(account);
    selectProps.onSelectionChange(account);
    onClose?.();
  };

  const handleDisconnect = () => {
    onClose?.();
    disconnect();
  };

  const title = getTitle(t, step, wallets.hasInstalled);

  const hasDisconnect = step === AuthModalSteps.ACCOUNT && account;

  return (
    <Modal align='top' isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody>
        <Disclaimer />
        <WalletStep wallets={wallets.available} step={step} onSelectionChange={handleWalletSelect} value={wallet} />
        {wallet && accounts && (
          <AccountStep
            step={step}
            wallet={wallet}
            accounts={accounts}
            value={account}
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
