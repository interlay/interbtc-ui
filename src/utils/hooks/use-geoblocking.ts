import { useEffect } from 'react';

import { GEOBLOCK_API_ENDPOINT, GEOBLOCK_REDIRECTION_LINK } from '@/config/links';
import { FeatureFlags, useFeatureFlag } from '@/utils/hooks/use-feature-flag';

const useGeoblocking = (): void => {
  const isGeoblockEnabled = useFeatureFlag(FeatureFlags.GEOBLOCK);

  useEffect(() => {
    if (!isGeoblockEnabled) return;

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
  }, [isGeoblockEnabled]);
};

export { useGeoblocking };
