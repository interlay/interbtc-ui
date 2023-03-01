import { BorrowPosition, LendPosition } from '@interlay/interbtc-api';
import Big from 'big.js';

import {
  useGetBorrowPositionsOfAccount,
  useGetLendPositionsOfAccount
} from '@/utils/hooks/api/loans/lend-and-borrow-info';

interface AccountPositionsData {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
}

interface PositionsThresholdsData {
  collateral: Big;
  liquidation: Big;
}

type UseGetAccountPositions = {
  data: Partial<AccountPositionsData> & {
    hasCollateral: boolean;
  };
  refetch: () => void;
};

const useGetAccountPositions = (): UseGetAccountPositions => {
  const { data: lendPositions, refetch: lendPositionsRefetch } = useGetLendPositionsOfAccount();

  const { data: borrowPositions, refetch: borrowPositionsRefetch } = useGetBorrowPositionsOfAccount();

  return {
    data: {
      borrowPositions: borrowPositions,
      lendPositions: lendPositions,
      hasCollateral: !!lendPositions?.find((position) => position.isCollateral)
    },
    refetch: () => {
      lendPositionsRefetch();
      borrowPositionsRefetch();
    }
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData, PositionsThresholdsData };
