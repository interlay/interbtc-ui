import { Key, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';

import { TabsProps } from '@/component-library';

const queryString = require('query-string');

type UsePageQueryParamsResult = {
  data: Record<string, string>;
  tabsProps: Pick<TabsProps, 'onSelectionChange' | 'defaultSelectedKey'>;
};

const usePageQueryParams = (): UsePageQueryParamsResult => {
  const history = useHistory();
  const location = useLocation();

  const data = useMemo(() => queryString.parse(location.search), [location.search]);

  const handleSelectionChange = (key: Key) => {
    const queryParameters = queryString.parse(location.search);
    queryParameters.tab = key;
    const updatedQueryString = queryString.stringify(queryParameters);

    history.replace({
      pathname: location.pathname,
      search: updatedQueryString
    });
  };

  return {
    data,
    tabsProps: {
      defaultSelectedKey: data.tab,
      onSelectionChange: handleSelectionChange
    }
  };
};

export { usePageQueryParams };
export type { UsePageQueryParamsResult };
