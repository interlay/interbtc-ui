import { HYDRA_URL } from '../../constants';

const GRAPHQL_FETCHER = 'graphql-fetcher';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const graphqlFetcher = <T>() => async ({ queryKey }: any): Promise<GraphqlReturn<T>> => {
  const [
    key,
    query,
    variables
  ] = queryKey;

  if (key !== GRAPHQL_FETCHER) {
    throw new Error('Invalid key!');
  }

  const response = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables || null
    })
  });

  return await response.json();
};

export {
  GRAPHQL_FETCHER
};

export type GraphqlReturn<T> = {
  data: {
    [key: string]: T;
  };
}

export default graphqlFetcher;
