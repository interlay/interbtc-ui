import { useQuery } from 'react-query';
import { Prices } from 'common/types/util.types';
import { PRICES_URL } from '../../../constants';

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

// Keeps fetching live data prices
// const { error: pricesError } = useQuery(
//   PRICES_URL,
//   async () => {
//     const response = await fetch(PRICES_URL);
//     if (!response.ok) {
//       throw new Error('Network response for prices was not ok.');
//     }

//     const newPrices = await response.json();

//     const { bitcoin, ...rest } = newPrices;
//     dispatch(
//       updateOfPricesAction({
//         bitcoin: bitcoin,
//         relayChainNativeToken: newPrices[TOKEN_PRICES.relayChainNativeToken],
//         governanceToken: newPrices[TOKEN_PRICES.governanceToken],
//         wrappedToken: newPrices[TOKEN_PRICES.wrappedToken],
//         ...rest
//       })
//     );
//   },
//   { refetchInterval: 60000 }
// );
// useErrorHandler(pricesError);
