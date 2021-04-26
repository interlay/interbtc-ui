
import { useHistory } from 'react-router-dom';

const queryString = require('query-string');

const useUpdateQueryParameters = (): (newQueryParameters: Record<string, string>) => void => {
  const history = useHistory();

  const updateQueryParameters = (newQueryParameters: Record<string, string>) => {
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

export default useUpdateQueryParameters;
