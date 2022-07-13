import { useQuery } from 'react-query';
import { Prices } from 'common/types/util.types';
import { PRICES_URL } from 'config/relay-chains';

const useGetPrices = (): Prices | undefined => {
  const { data } = useQuery<Prices, Error>(
    ['prices'],
    async () => {
      const response = await fetch(PRICES_URL);
      return response.json();
    },
    {
      refetchInterval: 60000
    }
  );

  return data ? data : undefined;
};

export { useGetPrices };
