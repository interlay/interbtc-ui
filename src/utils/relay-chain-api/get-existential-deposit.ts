import { ApiPromise } from '@polkadot/api';

const getExistentialDeposit = (api: ApiPromise): any => api.consts.balances.existentialDeposit;

export { getExistentialDeposit };
