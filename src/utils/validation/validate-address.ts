import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

const isValidPolkadotAddress = (address: string): boolean => {
  try {
    encodeAddress(
      isHex(address) ?
        hexToU8a(address) :
        decodeAddress(address)
    );

    return true;
  } catch (error: any) {
    return false;
  }
};

export default isValidPolkadotAddress;
