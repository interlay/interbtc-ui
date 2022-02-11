
import * as React from 'react';

import AccountSelector, { AccountOption } from './AccountSelector';
import {
  RelayChainLogoIcon,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';

const ACCOUNT_OPTIONS: Array<AccountOption> = [
  {
    name: RELAY_CHAIN_NAME,
    icon: <RelayChainLogoIcon height={46} />
  },
  {
    name: BRIDGE_PARACHAIN_NAME,
    icon: <BridgeParachainLogoIcon height={46} />
  }
];

const Accounts = (): JSX.Element => {
  // Set initial value to first item in CHAIN_OPTIONS object
  const [selectedChain, setselectedChain] = React.useState<AccountOption>(ACCOUNT_OPTIONS[0]);

  return (
    <AccountSelector
      chainOptions={ACCOUNT_OPTIONS}
      selectedChain={selectedChain}
      onChange={setselectedChain} />
  );
};

export type { AccountOption };
export default Accounts;
