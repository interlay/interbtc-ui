
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
  if (queryKey[1] === 'interBtcApi') {
    const [
      _key,
      arg1,
      arg2,
      arg3,
      ...rest
    ] = queryKey;

    if (_key !== GENERIC_FETCHER) {
      throw new Error('Invalid key!');
    }

    // TODO: should type properly
    return await window.bridge[arg1][arg2][arg3](...rest);
  }
  if (queryKey[1] === 'interBtcIndex') {
    const [
      _key,
      arg1,
      arg2,
      ...rest
    ] = queryKey;

    if (_key !== GENERIC_FETCHER) {
      throw new Error('Invalid key!');
    }

    return await window.bridge[arg1][arg2](...rest);
  }

  throw new Error('Something went wrong!');
};

export {
  GENERIC_FETCHER
};

export default genericFetcher;
