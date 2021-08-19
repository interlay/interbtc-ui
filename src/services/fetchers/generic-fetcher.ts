
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const GENERIC_FETCHER = 'generic-fetcher';

interface Arguments {
  queryKey: [
    string,
    string,
    string
  ]
}

const genericFetcher = <T>() => async ({ queryKey }: Arguments): Promise<T> => {
  const [
    _key,
    arg1,
    arg2,
    ...rest
  ] = queryKey;

  if (_key !== GENERIC_FETCHER) {
    throw new Error('Invalid key!');
  }

  // TODO: should type properly
  return await window.polkaBTC[arg1][arg2](...rest);
};

export {
  GENERIC_FETCHER
};

export default genericFetcher;
