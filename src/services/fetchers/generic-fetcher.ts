
const GENERIC_FETCHER = 'generic-fetcher';

// TODO: should type properly
// interface Arguments {
//   queryKey: [
//     string,
//     string,
//     string,
//     string
//   ]
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const genericFetcher = <T>() => async ({ queryKey }: any): Promise<T> => {
  if (queryKey[1] === 'interBtcIndex') {
    throw new Error('Unsupported indexer!');
  }
  const [
    _key,
    arg1,
    arg2,
    ...rest
  ] = queryKey;

  if (_key !== GENERIC_FETCHER) {
    throw new Error('Invalid key!');
  }

  try {
    // TODO: should type properly
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return await window.bridge[arg1][arg2](...rest);
  } catch (error) {
    throw new Error(`Error fetching ${queryKey}). ${error}`);
  }
};

export {
  GENERIC_FETCHER
};

export default genericFetcher;
