import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import { IconProps } from '../Icon';
import { FallbackIcon } from './FallbackIcon';
import { PolkadotJS, SubWallet, Talisman } from './icons';

type WalletComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

const wallet: Record<string, WalletComponent> = {
  'polkadot-js': PolkadotJS,
  'subwallet-js': SubWallet,
  talisman: Talisman
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
