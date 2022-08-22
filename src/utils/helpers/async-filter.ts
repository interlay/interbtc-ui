// MEMO: inspired by https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
function asyncFilter<T>(array: Array<T>, predicate: (arg: T) => Promise<boolean>): Promise<Array<T>> {
  return Promise.all(array.map(predicate)).then((results) => array.filter((_, index: number) => results[index]));
}

export default asyncFilter;
