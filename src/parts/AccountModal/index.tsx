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
import { WalletSourceName, WALLETS } from 'config/wallets';

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
  NoWalletFound,
  SelectWallet,
  NoAccountFound,
  SelectAccount,
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
  const [selectedWallet, setSelectedWallet] = React.useState<WalletSourceName | undefined>();

  const accounts = useGetAccounts();
  const accountsFromSelectedWallet = React.useMemo(() =>
    accounts.filter(({ meta: { source } }) => source === selectedWallet)
  , [
    accounts,
    selectedWallet
  ]);

  const supportedWalletInstalled = extensions
    .reduce(
      (result, extensionName) => result || Object.values(WalletSourceName).includes(extensionName as WalletSourceName),
      false
    );

  const handleWalletSelect = (walletName: WalletSourceName | undefined) => () => {
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
    dispatch(changeAddressAction(''));
    window.bridge.removeAccount();
    onClose();
  };

  React.useEffect(() => {
    // Sets selected wallet on modal open.
    if (open) {
      const selectedAccount = accounts.find(({ address: accountAddress }) => address === accountAddress);
      if (selectedAccount) {
        setSelectedWallet(selectedAccount.meta.source as WalletSourceName);
      } else {
        setSelectedWallet(undefined);
      }
    }
  }, [address, accounts, open]);

  // State of the modal content.
  const contentState = (() => {
    if (supportedWalletInstalled) {
      if (selectedWallet === undefined) {
        return AccountModalState.SelectWallet;
      } else {
        if (accounts !== undefined && accounts.length > 0) {
          return AccountModalState.SelectAccount;
        } else {
          return AccountModalState.NoAccountFound;
        }
      }
    } else {
      return AccountModalState.NoWalletFound;
    }
  })();

  const renderNoWalletFoundContent = () => (
    <>
      <p>
        {t('account_modal.install_supported_wallets')}
        <ExternalLink href={TERMS_AND_CONDITIONS_LINK}>terms and conditions</ExternalLink>
        .
      </p>
      <ul className={clsx('flex', 'flex-col', 'space-y-4')}>
        {/* Lists all supported wallets. */
          Object.values(WALLETS).map(({ name, LogoIcon, URL }) =>
            (
              <li key={name}>
                <ExternalLink
                  href={URL}>
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
                </ExternalLink>
              </li>
            )
          )
        }
      </ul>
    </>
  );

  const renderSelectWalletContent = () => (
    <ul
      className='space-y-4'>
      {extensions.map(extensionName => {
        const { LogoIcon, name } = WALLETS[extensionName as WalletSourceName];
        return (
          <li
            key={extensionName}>
            <InterlayButtonBase
              className={clsx(
                ACCOUNT_MODAL_BUTTON_CLASSES,
                'w-full'
              )}
              onClick={handleWalletSelect(extensionName as WalletSourceName)}>
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

  const renderNoAccountFoundContent = () => (
    // Create a new account when no accounts are available
    <p>
      {t('account_modal.no_account')}
      <ExternalLink href={selectedWallet && WALLETS[selectedWallet].URL}>
            &nbsp;{t('here')}
      </ExternalLink>
          .
    </p>
  );

  const renderSelectAccountContent = () => (
    // Lists all available accounts for selected wallet.
    <>
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
                  { [ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES]: selected },
                  'w-full'
                )}
                onClick={handleAccountSelect(account.address)}>
                <div
                  className={clsx(
                    'flex',
                    'flex-col',
                    'items-start'
                  )}>
                  <div className='font-medium'>
                    {account.meta.name}
                  </div>
                  <div>
                    {`(${shortAddress(account.address)})`}
                  </div>
                </div>
              </InterlayButtonBase>
              <CopyAddressButton
                className={ACCOUNT_MODAL_BUTTON_CLASSES}
                address={account.address} />
            </li>
          );
        })}
      </ul>
      <div className={clsx('flex', 'justify-between', 'items-center')}>
        <span>
          {t('account_modal.connected_with')}
          <span
            className={clsx(
              'font-bold',
              { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            {selectedWallet ? WALLETS[selectedWallet].name : '-'}
          </span>
        </span>
        <InterlayButtonBase
          className={ACCOUNT_MODAL_BUTTON_CLASSES}
          onClick={handleWalletSelect(undefined)}>
          {t('account_modal.change_wallet')}
        </InterlayButtonBase>
      </div>
      {address &&
          <InterlayButtonBase
            className={clsx(
              'w-full',
              ACCOUNT_MODAL_BUTTON_CLASSES,
              'justify-center'
            )}
            onClick={handleAccountDisconnect}>
            {t('account_modal.disconnect')}
          </InterlayButtonBase>
      }
    </>
  );

  const renderContent = () => {
    switch (contentState) {
    case AccountModalState.NoWalletFound:
      return renderNoWalletFoundContent();
    case AccountModalState.SelectWallet:
      return renderSelectWalletContent();
    case AccountModalState.NoAccountFound:
      return renderNoAccountFoundContent();
    case AccountModalState.SelectAccount:
      return renderSelectAccountContent();
    }
  };

  const modalTitle = (() => {
    switch (contentState) {
    case AccountModalState.NoWalletFound:
      return t('account_modal.install_wallet');
    case AccountModalState.SelectWallet:
      return t('account_modal.select_wallet');
    case AccountModalState.NoAccountFound:
      return t('account_modal.create_account');
    case AccountModalState.SelectAccount:
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
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default AccountModal;
