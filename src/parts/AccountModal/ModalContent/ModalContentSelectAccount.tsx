import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { shortAddress } from '@/common/utils/utils';
import CopyAddressButton from '@/components/CopyAddressButton';
import InterlayButtonBase from '@/components/UI/InterlayButtonBase';
import { WALLETS, WalletSourceName } from '@/config/wallets';
import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

import { ACCOUNT_MODAL_BUTTON_CLASSES, ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES } from '..';

interface ModalContentSelectAccountProps {
  accountsFromSelectedWallet: InjectedAccountWithMeta[];
  address: string;
  selectedWallet: WalletSourceName;
  handleAccountSelect: (address: string) => void;
  handleWalletSelect: (wallet: WalletSourceName | undefined) => void;
  handleAccountDisconnect: () => void;
}

const ModalContentSelectAccount = ({
  accountsFromSelectedWallet,
  address,
  selectedWallet,
  handleAccountSelect,
  handleWalletSelect,
  handleAccountDisconnect
}: ModalContentSelectAccountProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <ul className='space-y-4'>
        {accountsFromSelectedWallet.map((account) => {
          const selected = address === account.address;

          return (
            <li key={account.address} className={clsx('flex', 'space-x-2')}>
              <InterlayButtonBase
                className={clsx(
                  ACCOUNT_MODAL_BUTTON_CLASSES,
                  { [ACCOUNT_MODAL_BUTTON_SELECTED_CLASSES]: selected },
                  'w-full'
                )}
                onClick={() => handleAccountSelect(account.address)}
              >
                <div className={clsx('flex', 'flex-col', 'items-start')}>
                  <div className='font-medium'>{account.meta.name}</div>
                  <div>{`(${shortAddress(account.address)})`}</div>
                </div>
              </InterlayButtonBase>
              <CopyAddressButton className={ACCOUNT_MODAL_BUTTON_CLASSES} address={account.address} />
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
            )}
          >
            {selectedWallet ? WALLETS[selectedWallet].name : '-'}
          </span>
        </span>
        <InterlayButtonBase className={ACCOUNT_MODAL_BUTTON_CLASSES} onClick={() => handleWalletSelect(undefined)}>
          {t('account_modal.change_wallet')}
        </InterlayButtonBase>
      </div>
      {address && (
        <InterlayButtonBase
          className={clsx('w-full', ACCOUNT_MODAL_BUTTON_CLASSES, 'justify-center')}
          onClick={handleAccountDisconnect}
        >
          {t('account_modal.disconnect')}
        </InterlayButtonBase>
      )}
    </>
  );
};

export default ModalContentSelectAccount;
