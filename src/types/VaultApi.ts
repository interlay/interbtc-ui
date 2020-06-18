import { Redeem } from './VaultState';

export interface VaultInterface {
  getRedeems(): Promise<Redeem[]>;
}