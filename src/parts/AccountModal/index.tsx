
import * as React from 'react';
import clsx from 'clsx';
import { KeyringPair } from '@polkadot/keyring/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useSubstrate } from 'substrate-lib';

import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface KeyringOption {
  id: string;
  name: string;
  value: string;
}

const AccountModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const focusRef = React.useRef(null);

  const {
    state: { keyring },
    selectedAccountAddress,
    setSelectedAccountAddress
  } = useSubstrate();

  // Get the list of accounts we possess the private key for
  const keyringOptions = React.useMemo(() => {
    return keyring.getPairs().map((account: KeyringPair) => ({
      id: account.address,
      name: (account.meta.name as string).toUpperCase(),
      value: account.address
    }));
  }, [keyring]);

  React.useEffect(() => {
    if (!keyringOptions) return;
    if (!setSelectedAccountAddress) return;

    if (!selectedAccountAddress) {
      setSelectedAccountAddress(keyringOptions[0].value);
    }
  }, [
    selectedAccountAddress,
    keyringOptions,
    setSelectedAccountAddress
  ]);

  React.useEffect(() => {
    if (!selectedAccountAddress) return;
    (async () => {
      try {
        const { signer } = await web3FromAddress(selectedAccountAddress);
        window.bridge.interBtcApi.setAccount(selectedAccountAddress, signer);
      } catch (error) {
        console.log('[AccountModal React.useEffect] error.message => ', error.message);
      }
    })();
  }, [selectedAccountAddress]);

  const handleAccountSelect = (newKeyringOption: KeyringOption) => () => {
    setSelectedAccountAddress(newKeyringOption.value);
    onClose();
  };

  const renderContent = () => {
    return (
      // List all available accounts
      <ul className='space-y-4'>
        {keyringOptions.map((keyringOption: KeyringOption) => {
          const selected = selectedAccountAddress === keyringOption.value;
          return (
            <li
              key={keyringOption.value}
              className={clsx(
                'rounded',
                'border',
                'border-solid',
                'shadow-sm',
                // TODO: could be reused
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
                  // eslint-disable-next-line max-len
                  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )
              )}>
              <InterlayButtonBase
                className={clsx(
                  'px-5',
                  'py-3',
                  'space-x-1.5',
                  'w-full'
                )}
                onClick={handleAccountSelect(keyringOption)}>
                <span className='font-medium'>
                  {keyringOption.name}
                </span>
                <span>
                  {`(${shortAddress(keyringOption.value)})`}
                </span>
              </InterlayButtonBase>
            </li>
          );
        })}
      </ul>
    );
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
          Select account
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
