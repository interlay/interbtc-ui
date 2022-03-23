import { ApiPromise } from '@polkadot/api';

// TODO: resolve type error related to Codec type and cast properly
const getExistentialDeposit = (api: ApiPromise): any => api.consts.balances.existentialDeposit;

export { getExistentialDeposit };
