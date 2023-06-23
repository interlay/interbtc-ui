import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import { BTC_ADDRESS_REGEX } from '@/constants';

const btcAddressRegex = new RegExp(BTC_ADDRESS_REGEX);

// TODO: use library instead
const isValidBTCAddress = (address: string): boolean => btcAddressRegex.test(address);

const isValidRelayAddress = (address: string): boolean => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch {
    return false;
  }
};

export { isValidBTCAddress, isValidRelayAddress };
