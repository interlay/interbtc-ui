import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import { WalletName } from '@/utils/constants/wallets';

import { IconProps } from '../Icon';
import { FallbackIcon } from './FallbackIcon';
import { PolkadotJS, SubWallet, Talisman } from './icons';

type WalletComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

const wallet: Record<string, WalletComponent> = {
  [WalletName.PolkadotJS]: PolkadotJS,
  [WalletName.SubWallet]: SubWallet,
  [WalletName.Talisman]: Talisman
};

type Props = {
  name: string;
};

type NativeAttrs = Omit<IconProps, keyof Props>;

type WalletIconProps = Props & NativeAttrs;

const WalletIcon = forwardRef<SVGSVGElement, WalletIconProps>(
  ({ name, ...props }, ref): JSX.Element => {
    const WalletIcon = wallet[name];

    if (!WalletIcon) {
      return <FallbackIcon ref={ref} name={name} {...props} />;
    }

    return <WalletIcon ref={ref} {...props} />;
  }
);

WalletIcon.displayName = 'WalletIcon';

export { WalletIcon };
export type { WalletIconProps };
