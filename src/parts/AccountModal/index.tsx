import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// ray test touch <
import { Keyring } from '@polkadot/keyring';
// ray test touch >
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import InterlayModal, { InterlayModalInnerWrapper } from '@/components/UI/InterlayModal';
import { WalletSourceName } from '@/config/wallets';
// ray test touch <
import { SS58_FORMAT } from '@/constants';
// ray test touch >
import { useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import AccountModalContentWrapper from './ModalContent/AccountModalContentWrapper';
import ModalContentNoAccountFound from './ModalContent/ModalContentNoAccountFound';
import ModalContentNoWalletFound from './ModalContent/ModalContentNoWalletFound';
import ModalContentSelectAccount from './ModalContent/ModalContentSelectAccount';
import ModalContentSelectWallet from './ModalContent/ModalContentSelectWallet';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCOUNT_MODAL_BUTTON_CLASSES = clsx(
  'px-5',
  'py-3',
  'space-x-1.5',
  'rounded',
  'border',
  'border-solid',
  'shadow-sm',
  { 'hover:bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES = clsx(
  { 'text-interlayDenim-700': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'dark:hover:bg-opacity-100': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const AccountModal = ({ open, onClose }: Props): JSX.Element => {
  const { extensions, selectedAccount, accounts } = useSubstrateSecureState();

  const { t } = useTranslation();
  const focusRef = React.useRef(null);
  const [selectedWallet, setSelectedWallet] = React.useState<WalletSourceName | undefined>();

  const accountsFromSelectedWallet = React.useMemo(
    () => accounts.filter(({ meta: { source } }) => source === selectedWallet),
    [accounts, selectedWallet]
  );

  const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  const supportedExtensions = React.useMemo(
    () => extensions.filter((item) => Object.values(WalletSourceName).includes(item.name as WalletSourceName)),
    [extensions]
  );

  React.useEffect(() => {
    // Sets selected wallet on modal open.
    if (open) {
      if (selectedAccount) {
        setSelectedWallet(selectedAccount.meta.source as WalletSourceName);
      } else {
        setSelectedWallet(undefined);
      }
    }
  }, [selectedAccount, open]);

  // State of the modal content.
  const modalContent = React.useMemo(() => {
    if (!setSelectedAccount) return;
    if (!removeSelectedAccount) return;

    const handleWalletSelect = (walletName: WalletSourceName | undefined) => {
      setSelectedWallet(walletName);
    };

    const handleAccountSelect = async (newAccount: InjectedAccountWithMeta) => {
      // ray test touch <
      const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_FORMAT });
      const theSelectedAccount = keyring.addFromAddress(newAccount.address, newAccount.meta);
      setSelectedAccount(theSelectedAccount);
      // ray test touch >
      onClose();
    };

    const handleAccountDisconnect = () => {
      removeSelectedAccount();
      onClose();
    };

    if (supportedExtensions.length > 0) {
      if (selectedWallet === undefined) {
        return (
          <AccountModalContentWrapper title={t('account_modal.select_wallet')} focusRef={focusRef} onClose={onClose}>
            <ModalContentSelectWallet extensions={supportedExtensions} handleWalletSelect={handleWalletSelect} />
          </AccountModalContentWrapper>
        );
      } else {
        if (accounts !== undefined && accounts.length > 0) {
          return (
            <AccountModalContentWrapper title={t('account_modal.select_account')} focusRef={focusRef} onClose={onClose}>
              <ModalContentSelectAccount
                accountsFromSelectedWallet={accountsFromSelectedWallet}
                address={selectedAccount ? selectedAccount.address : ''}
                selectedWallet={selectedWallet}
                handleAccountSelect={handleAccountSelect}
                handleAccountDisconnect={handleAccountDisconnect}
                handleWalletSelect={handleWalletSelect}
              />
            </AccountModalContentWrapper>
          );
        } else {
          return (
            <AccountModalContentWrapper title={t('account_modal.create_account')} focusRef={focusRef} onClose={onClose}>
              <ModalContentNoAccountFound selectedWallet={selectedWallet} />
            </AccountModalContentWrapper>
          );
        }
      }
    } else {
      return (
        <AccountModalContentWrapper title={t('account_modal.install_wallet')} focusRef={focusRef} onClose={onClose}>
          <ModalContentNoWalletFound />
        </AccountModalContentWrapper>
      );
    }
  }, [
    accounts,
    accountsFromSelectedWallet,
    selectedAccount,
    supportedExtensions,
    onClose,
    selectedWallet,
    t,
    setSelectedAccount,
    removeSelectedAccount
  ]);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>{modalContent}</InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default AccountModal;

export { ACCOUNT_MODAL_BUTTON_CLASSES, ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES };
