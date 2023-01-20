import { deposit, withdraw } from './pool';

const amm = {
  pool: {
    deposit,
    withdraw
  }
};

export default amm;
export type { PoolDepositSchemaParams } from './pool';
