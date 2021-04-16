
import { useLocation } from 'react-router-dom';

const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};

export default useQuery;
