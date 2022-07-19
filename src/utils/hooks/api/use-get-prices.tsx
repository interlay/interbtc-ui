import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { Prices } from '@/common/types/util.types';
import { PRICES_URL } from '@/constants';

const useGetPrices = (): Prices | undefined => {
  const { data, error } = useQuery<Prices, Error>(
    ['prices'],
    async () => {
      const response = await fetch(PRICES_URL);
      return response.json();
    },
    {
      refetchInterval: 60000
    }
  );

  useEffect(() => {
    if (!error) return;

    console.warn('Unable to fetch prices', error);
  }, [error]);

  return data ? data : undefined;
};

export { useGetPrices };
