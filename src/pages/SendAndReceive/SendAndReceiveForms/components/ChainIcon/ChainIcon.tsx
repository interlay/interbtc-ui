import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import { IconProps } from '@/component-library/Icon';

import { StyledFallbackIcon } from './ChainIcon.style';
import {
  ACALA,
  ASTAR,
  BIFROST,
  BIFROST_POLKADOT,
  HYDRA,
  INTERLAY,
  KARURA,
  KINTSUGI,
  KUSAMA,
  POLKADOT,
  STATEMINE,
  STATEMINT
} from './icons';

type ChainComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

const chainsIcon: Record<string, ChainComponent> = {
  ACALA,
  ASTAR,
  BIFROST,
  BIFROST_POLKADOT,
  HYDRA,
  INTERLAY,
  KARURA,
  KINTSUGI,
  KUSAMA,
  POLKADOT,
  STATEMINE,
  STATEMINT
};

type Props = {
  id: string;
};

type NativeAttrs = Omit<IconProps, keyof Props>;

type ChainIconProps = Props & NativeAttrs;

const ChainIcon = forwardRef<SVGSVGElement, ChainIconProps>(
  ({ id, ...props }, ref): JSX.Element => {
    // id is returned from api as lowercase, e.g. 'interlay'
    const ChainIcon = chainsIcon[id.toUpperCase()];

    if (!ChainIcon) {
      return (
        <StyledFallbackIcon {...props} ref={ref} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>{id}</title>
          <circle cx='12' cy='12' r='11.5' fill='currentColor' />
        </StyledFallbackIcon>
      );
    }

    return <ChainIcon ref={ref} {...props} />;
  }
);

ChainIcon.displayName = 'CoinIcon';

export { ChainIcon };
export type { ChainIconProps };
