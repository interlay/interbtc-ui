
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
import useGetAccounts from 'utils/hooks/use-get-accounts';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { changeAddressAction } from 'common/actions/general.actions';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';

const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCOUNT_MODAL_BUTTON_STYLES = clsx(
  'px-5',
  'py-3',
  'space-x-1.5',
  'rounded',
  'border',
  'border-solid',
  'shadow-sm'
);

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

  const accounts = useGetAccounts();
  const extensionWalletAvailable = extensions.length > 0;

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

  const renderContent = () => {
    if (extensionWalletAvailable) {
      return (
        <>
          {accounts !== undefined && accounts.length > 0 ? (
            // List all available accounts
            <ul className='space-y-4'>
              {accounts.map(account => {
                const selected = address === account.address;

                return (
                  <li
                    key={account.address}
                    className={clsx(
                      'flex')}>
                    <InterlayButtonBase
                      className={clsx(
                        ACCOUNT_MODAL_BUTTON_STYLES,
                        'w-full',
                        selected ? clsx(
                          { 'text-interlayDenim-700':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                          { 'dark:text-kintsugiMidnight-700':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                          { 'bg-interlayHaiti-50':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                          { 'dark:bg-white':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                        ) : clsx(
                          { 'text-interlayTextPrimaryInLightMode':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                          { 'dark:text-kintsugiTextPrimaryInDarkMode':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                          { 'hover:bg-interlayHaiti-50':
                            process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                          { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                          { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                        )
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
                      className={ACCOUNT_MODAL_BUTTON_STYLES}
                      address={account.address} />
                  </li>
                );
              })}
            </ul>
          ) : (
            // Create a new account when no accounts are available
            <p>
              {t('no_account')}
              <ExternalLink href={POLKADOT_EXTENSION}>
                &nbsp;{t('here')}
              </ExternalLink>
              .
            </p>
          )}
        </>
      );
    } else {
      return (
        <>
          <p>
            {t('install_supported_wallets')}
            <ExternalLink href={TERMS_AND_CONDITIONS_LINK}>terms and conditions</ExternalLink>
            .
          </p>
          <ExternalLink href={POLKADOT_EXTENSION}>
            <span
              className={clsx(
                'inline-flex',
                'items-center',
                'space-x-1.5'
              )}>
              <PolkadotExtensionLogoIcon
                width={30}
                height={30} />
              <span>Polkadot.js</span>
            </span>
          </ExternalLink>
        </>
      );
    }
  };

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
          {extensionWalletAvailable ?
            'Select account' :
            'Pick a wallet'
          }
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
