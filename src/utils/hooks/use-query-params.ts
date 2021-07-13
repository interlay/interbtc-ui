
import { useLocation } from 'react-router-dom';

const useQueryParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};

export default useQueryParams;
