import { InjectedExtension } from '@polkadot/extension-inject/types';
import clsx from 'clsx';

import InterlayButtonBase from '@/components/UI/InterlayButtonBase';
import { WALLETS, WalletSourceName } from '@/config/wallets';

import { ACCOUNT_MODAL_BUTTON_CLASSES } from '..';

interface ModalContentSelectWalletProps {
  extensions: InjectedExtension[];
  handleWalletSelect: (wallet: WalletSourceName | undefined) => void;
}

const ModalContentSelectWallet = ({ extensions, handleWalletSelect }: ModalContentSelectWalletProps): JSX.Element => (
  <ul className='space-y-4'>
    {extensions.map((item) => {
      const { LogoIcon, name } = WALLETS[item.name as WalletSourceName];
      return (
        <li key={item.name}>
          <InterlayButtonBase
            className={clsx(ACCOUNT_MODAL_BUTTON_CLASSES, 'w-full')}
            onClick={() => handleWalletSelect(item.name as WalletSourceName)}
          >
            <LogoIcon width={30} height={30} />
            <span className='pl-2'>{name}</span>
          </InterlayButtonBase>
        </li>
      );
    })}
  </ul>
);

export default ModalContentSelectWallet;
