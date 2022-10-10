import { CurrencyIdLiteral } from '@interlay/interbtc-api';

type LendAssetData = {
  currency: CurrencyIdLiteral;
  apy: string;
  apyAssets: CurrencyIdLiteral[];
  balance: string;
};

type LendPositionData = {
  currency: CurrencyIdLiteral;
  amount: string;
  apy: string;
  apyEarned: string;
};

type LendData = {
  positions: LendPositionData[];
  assets: LendAssetData[];
};

type BorrowAssetData = {
  currency: CurrencyIdLiteral;
  apy: string;
  available: string;
  liquidity: string;
};

type BorrowPositionData = {
  currency: CurrencyIdLiteral;
  amount: string;
  apy: string;
};

type BorrowData = {
  positions: BorrowPositionData[];
  assets: BorrowAssetData[];
};

type LoansData = {
  positions: {
    supply: string;
    borrow: string;
    apyEarned: string;
    loanStatus: string;
  };
  lend: LendData;
  borrow: BorrowData;
};

const useGetLoansData = (): LoansData => {
  return {
    positions: {
      supply: '$0.00',
      borrow: '$0.00',
      apyEarned: '$0.00',
      loanStatus: 'Safe'
    },
    lend: {
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
    },
    borrow: {
      positions: [{ currency: CurrencyIdLiteral.DOT, apy: '-4.01%', amount: '1.12454' }],
      assets: [
        {
          currency: CurrencyIdLiteral.DOT,
          apy: '4.01%',
          available: '1.22',
          liquidity: '1M'
        },
        {
          currency: CurrencyIdLiteral.KSM,
          apy: '16.98%',
          available: '1.22',
          liquidity: '1M'
        }
      ]
    }
  };
};

export { useGetLoansData };
export type { BorrowAssetData, BorrowData, BorrowPositionData, LendAssetData, LendData, LendPositionData };
