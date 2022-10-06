import { CurrencyIdLiteral } from '@interlay/interbtc-api';

type SupplyAssetData = {
  currency: CurrencyIdLiteral;
  apy: string;
  apyAssets: CurrencyIdLiteral[];
  balance: string;
};

type SupplyPositionData = {
  currency: CurrencyIdLiteral;
  amount: string;
  apy: string;
  apyEarned: string;
};

type SupplyData = {
  positions: SupplyPositionData[];
  assets: SupplyAssetData[];
};

type LoansData = {
  positions: {
    supply: string;
    borrow: string;
    apyEarned: string;
    loanStatus: string;
  };
  supply: SupplyData;
};

const useGetLoansData = (): LoansData => {
  return {
    positions: {
      supply: '$0.00',
      borrow: '$0.00',
      apyEarned: '$0.00',
      loanStatus: 'Safe'
    },
    supply: {
      positions: [{ currency: CurrencyIdLiteral.DOT, apy: '4.01%', amount: '1.12454', apyEarned: '1.02%' }],
      assets: [
        {
          currency: CurrencyIdLiteral.DOT,
          apy: '4.01%',
          apyAssets: [CurrencyIdLiteral.KINT],
          balance: '1.12454'
        },
        {
          currency: CurrencyIdLiteral.KSM,
          apy: '16.98%',
          apyAssets: [CurrencyIdLiteral.KINT, CurrencyIdLiteral.DOT],
          balance: '1.12454'
        }
      ]
    }
  };
};

export { useGetLoansData };
export type { SupplyAssetData, SupplyData, SupplyPositionData };
