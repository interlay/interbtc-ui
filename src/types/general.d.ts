type TreasuryAction = 'issue' | 'redeem';

enum TXType {
  Issue = 'issue',
  Redeem = 'redeem',
  Replace = 'replace'
}

export type { TreasuryAction };

export { TXType };
