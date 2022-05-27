import { useHistory } from 'react-router-dom';

const queryString = require('query-string');

const useUpdateQueryParameters = (): ((newQueryParameters: QueryParameters) => void) => {
  const history = useHistory();

  const updateQueryParameters = (newQueryParameters: QueryParameters) => {
    const location = history.location;
    let queryParameters = queryString.parse(location.search);
    queryParameters = {
      ...queryParameters,
      ...newQueryParameters
    };

    history.push({
      ...location,
      search: queryString.stringify(queryParameters)
    });
  };

  return updateQueryParameters;
};

export type QueryParameters = Record<string, string>;

export default useUpdateQueryParameters;
