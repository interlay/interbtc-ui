import { Key, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { LinkProps } from 'react-router-dom';

import { TabsProps } from '@/component-library';

const queryString = require('query-string');

type UsePageQueryParamsResult = {
  data: Record<string, string>;
  tabsProps: Pick<TabsProps, 'onSelectionChange' | 'defaultSelectedKey'>;
  getLinkProps: (page: string, query: Record<string, unknown>) => Pick<LinkProps, 'to'>;
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

  const getLinkProps = (page: string, query: Record<string, unknown>) => ({
    to: {
      pathname: page,
      search: queryString.stringify(query)
    }
  });

  return {
    data,
    getLinkProps,
    tabsProps: {
      defaultSelectedKey: data.tab,
      onSelectionChange: handleSelectionChange
    }
  };
};

export { usePageQueryParams };
export type { UsePageQueryParamsResult };
