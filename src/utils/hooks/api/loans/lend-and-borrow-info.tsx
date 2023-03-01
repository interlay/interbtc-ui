import { BorrowPosition, LendPosition, LoanCollateralInfo } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import useAccountId from '@/utils/hooks/use-account-id';

const useGetLendPositionsOfAccount = (): {
  data: Array<LendPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getLendPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getLendPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

const useGetBorrowPositionsOfAccount = (): {
  data: Array<BorrowPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getBorrowPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getBorrowPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

const useGetLoanCollateralInfo = (): {
  data: LoanCollateralInfo | undefined;
  refetch: () => void;
} => {
  const { data: lendPositions, refetch: lendPositionsRefetch } = useGetLendPositionsOfAccount();

  const { data: borrowPositions, refetch: borrowPositionsRefetch } = useGetBorrowPositionsOfAccount();

  const { data: loanAssets, refetch: loanAssetsRefetch } = useGetLoanAssets();

  const loanCollateralInfo =
    !lendPositions || !borrowPositions || !loanAssets
      ? undefined
      : window.bridge.loans.getLoanCollateralInfo(lendPositions, borrowPositions, loanAssets);

  return {
    data: loanCollateralInfo,
    refetch: () => {
      lendPositionsRefetch();
      borrowPositionsRefetch();
      loanAssetsRefetch();
    }
  };
};

export { useGetBorrowPositionsOfAccount, useGetLendPositionsOfAccount, useGetLoanCollateralInfo };
