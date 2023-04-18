import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = (): URLSearchParams => {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location]);

  return queryParams;
};

export default useQueryParams;
