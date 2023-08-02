import { ApiPromise } from '@polkadot/api';
import { DispatchError } from '@polkadot/types/interfaces';

const getErrorMessage = (api: ApiPromise, dispatchError: DispatchError): string => {
  const { isModule, asModule, isBadOrigin } = dispatchError;

  // Runtime error in one of the parachain modules
  if (isModule) {
    // for module errors, we have the section indexed, lookup
    const decoded = api.registry.findMetaError(asModule);
    const { docs, name, section } = decoded;
    return `The error code is ${section}.${name}. ${docs.join(' ')}.`;
  }

  // Bad origin
  if (isBadOrigin) {
    return `The error is caused by using an incorrect account. The error code is BadOrigin ${dispatchError}.`;
  }

  return `The error is ${dispatchError}.`;
};

export { getErrorMessage };
