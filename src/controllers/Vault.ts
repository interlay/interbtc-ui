import { VaultInterface } from '../types/VaultApi';
import { Redeem } from '../types/VaultState';

export class Vault implements VaultInterface {
  async getRedeems(): Promise<Redeem[]> {
    let result = await fetch('http://localhost:8000/redeems');
    return JSON.parse(await result.text());
  }
}
