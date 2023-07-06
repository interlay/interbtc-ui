import { useGetBalances } from './api/tokens/use-get-balances';

type UseFormBalancesResult = {};

const useFormBalances = () => {
  const { getAvailableBalance } = useGetBalances();

  return {};
};
