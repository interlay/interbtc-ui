import clsx from 'clsx';

import { WALLETS, WalletSourceName } from 'config/wallets';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import { ACCOUNT_MODAL_BUTTON_CLASSES } from '..';

interface ModalContentSelectWalletProps {
  extensions: string[];
  handleWalletSelect: (wallet: WalletSourceName | undefined) => void;
}

const ModalContentSelectWallet = ({
  extensions,
  handleWalletSelect
}: ModalContentSelectWalletProps): JSX.Element => (
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
            onClick={() => handleWalletSelect(extensionName as WalletSourceName)}>
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

export default ModalContentSelectWallet;
