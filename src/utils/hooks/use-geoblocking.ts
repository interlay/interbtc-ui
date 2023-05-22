import { useEffect } from 'react';

import { GEOBLOCK_API_ENDPOINT, GEOBLOCK_REDIRECTION_LINK } from '@/config/links';

const useGeoblocking = (): void => {
  useEffect(() => {
    const checkCountry = async () => {
      try {
        const response = await fetch(GEOBLOCK_API_ENDPOINT);
        if (response.status === 403) {
          console.log('Access from forbidden country detected, user will be redirected.');
          window.location.replace(GEOBLOCK_REDIRECTION_LINK);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkCountry();
  }, []);
};

export { useGeoblocking };
