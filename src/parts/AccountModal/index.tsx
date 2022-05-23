import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';

import ExternalLink from 'components/ExternalLink';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import CopyAddressButton from 'components/CopyAddressButton';
import {
  APP_NAME,
  TERMS_AND_CONDITIONS_LINK
} from 'config/relay-chains';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import useGetAccounts from 'utils/hooks/api/use-get-accounts';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { changeAddressAction } from 'common/actions/general.actions';

import { InjectedWalletSourceName, WALLETS_DATA } from 'utils/constants/wallets';

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
  { 'hover:bg-interlayHaiti-50':
  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES = clsx(
  { 'text-interlayDenim-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'bg-interlayHaiti-50':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:bg-white':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'dark:hover:bg-opacity-100':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

enum AccountModalState {
  NO_WALLET_FOUND,
  SELECT_WALLET,
  NO_ACCOUNT_FOUND,
  SELECT_ACCOUNT,
}

const AccountModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const focusRef = React.useRef(null);
  const [selectedWallet, setSelectedWallet] = React.useState<InjectedWalletSourceName | undefined>();

  const accounts = useGetAccounts();
  const accountsFromSelectedWallet = React.useMemo(() =>
    accounts.filter(({ meta: { source } }) => source === selectedWallet)
  , [
    accounts,
    selectedWallet
  ]);

  const extensionWalletAvailable = extensions.length > 0;

  const handleWalletSelect = (walletName: InjectedWalletSourceName) => () => {
    setSelectedWallet(walletName);
  };

  const handleAccountSelect = (newAddress: string) => async () => {
    if (!bridgeLoaded) {
      return;
    }

    // TODO: should check when the app being initialized (not check everywhere)
    await web3Enable(APP_NAME);
    const { signer } = await web3FromAddress(newAddress);
    window.bridge.setAccount(newAddress, signer);
    dispatch(changeAddressAction(newAddress));

    onClose();
  };

  const handleAccountDisconnect = () => {
    setSelectedWallet(undefined);
    dispatch(changeAddressAction(''));
    // TODO: how to handle window.bridge.setAccount('');
    console.log('disconnecting...');
  };

  React.useEffect(() => {
    // Sets selected wallet on modal open.
    const selectedAccount = accounts.find(({ address: accountAddress }) => address === accountAddress);
    if (selectedAccount) {
      setSelectedWallet(selectedAccount.meta.source as InjectedWalletSourceName);
    } else {
      setSelectedWallet(undefined);
    }
  }, [address, accounts, open]);

  // State of the modal content.
  const contentState = (() => {
    // TODO: check against supported wallets not all injected extensions found
    if (extensionWalletAvailable) {
      if (selectedWallet === undefined) {
        return AccountModalState.SELECT_WALLET;
      } else {
        if (accounts !== undefined && accounts.length > 0) {
          return AccountModalState.SELECT_ACCOUNT;
        } else {
          return AccountModalState.NO_ACCOUNT_FOUND;
        }
      }
    } else {
      return AccountModalState.NO_WALLET_FOUND;
    }
  })();

  const renderContent = () => {
    switch (contentState) {
    case AccountModalState.NO_WALLET_FOUND:
      return (
        <>
          <p>
            {t('install_supported_wallets')}
            <ExternalLink href={TERMS_AND_CONDITIONS_LINK}>terms and conditions</ExternalLink>
            .
          </p>
          {/* Lists all supported wallets. */
            Object.values(WALLETS_DATA).map(({ name, LogoIcon, URL }) =>
              (
                <ExternalLink
                  href={URL}
                  key={name}>
                  <span
                    className={clsx(
                      'inline-flex',
                      'items-center',
                      'space-x-1.5'
                    )}>
                    <LogoIcon
                      width={30}
                      height={30} />
                    <span>{name}</span>
                  </span>
                </ExternalLink>)
            )
          }
        </>
      );
    case AccountModalState.SELECT_WALLET:
      // TODO: Implement list of wallets.
      return (
        <ul
          className={clsx(
            'space-y-4'
          )}>
          {extensions.map(extensionName => {
            const { LogoIcon, name } = WALLETS_DATA[extensionName as InjectedWalletSourceName];
            return (
              <li
                key={extensionName}>
                <InterlayButtonBase
                  className={clsx(
                    ACCOUNT_MODAL_BUTTON_CLASSES,
                    'w-full'
                  )}
                  onClick={handleWalletSelect(extensionName as InjectedWalletSourceName)}>
                  <LogoIcon
                    width={30}
                    height={30} />
                  <span className='pl-2'>
                    {name}
                  </span>
                </InterlayButtonBase>
              </li>
            );
          }
          )}
        </ul>
      );
    case AccountModalState.NO_ACCOUNT_FOUND:
      return (
      // Create a new account when no accounts are available
        <p>
          {t('no_account')}
          <ExternalLink href={selectedWallet && WALLETS_DATA[selectedWallet].URL}>
              &nbsp;{t('here')}
          </ExternalLink>
            .
        </p>
      );
    case AccountModalState.SELECT_ACCOUNT:
      return (
      // Lists all available accounts for selected wallet.
        <ul className='space-y-4'>
          {accountsFromSelectedWallet.map(account => {
            const selected = address === account.address;

            return (
              <li
                key={account.address}
                className={clsx(
                  'flex',
                  'space-x-2'
                )}>
                <InterlayButtonBase
                  className={clsx(
                    ACCOUNT_MODAL_BUTTON_CLASSES,
                    'w-full',
                    { [ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES]: selected }
                  )}
                  onClick={handleAccountSelect(account.address)}>
                  <span className='font-medium'>
                    {account.meta.name}
                  </span>
                  <span>
                    {`(${shortAddress(account.address)})`}
                  </span>
                </InterlayButtonBase>
                <CopyAddressButton
                  className={ACCOUNT_MODAL_BUTTON_CLASSES}
                  address={account.address} />
                {selected &&
                    <InterlayButtonBase
                      className={ACCOUNT_MODAL_BUTTON_CLASSES}
                      onClick={handleAccountDisconnect}>
                      {t('disconnect')}
                    </InterlayButtonBase>
                }
              </li>
            );
          })}
        </ul>
      );
    }
  };

  const modalTitle = (() => {
    switch (contentState) {
    case AccountModalState.NO_WALLET_FOUND:
      return t('account_modal.install_wallet');
    case AccountModalState.SELECT_WALLET:
      return t('account_modal.select_wallet');
    case AccountModalState.NO_ACCOUNT_FOUND:
      return t('account_modal.create_account');
    case AccountModalState.SELECT_ACCOUNT:
      return t('account_modal.select_account');
    }
  })();

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={onClose}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'mb-6'
          )}>
          {modalTitle}
        </InterlayModalTitle>
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <div className='space-y-4'>
          {renderContent()}
          <div
            className={clsx(
              'flex',
              'justify-end'
            )}>
            <InterlayMulberryOutlinedButton onClick={onClose}>
              Close
            </InterlayMulberryOutlinedButton>
          </div>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default AccountModal;
