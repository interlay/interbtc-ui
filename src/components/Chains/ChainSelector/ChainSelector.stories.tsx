
import {
  Story,
  Meta
} from '@storybook/react';
import {
  WrappedTokenLogoIcon,
  CollateralTokenLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';

import ChainSelector, { Props, ChainOption } from './';

const chainOptions: Array<ChainOption> = [
  {
    name: RELAY_CHAIN_NAME,
    icon: <CollateralTokenLogoIcon height={26} />
  },
  {
    name: BRIDGE_PARACHAIN_NAME,
    icon: <WrappedTokenLogoIcon height={26} />
  }
];

const Template: Story<Props> = () => {
  return (
    <ChainSelector
      onChange={() => null}
      currentChain={chainOptions[0]}
      chainOptions={chainOptions} />
  );
};

const Default = Template.bind({});

export {
  Default
};

export default {
  title: 'Chains',
  component: ChainSelector
} as Meta;
