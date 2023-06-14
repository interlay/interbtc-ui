import { Key } from 'react';
import { useHistory, useLocation } from 'react-router';

import { TabsProps } from '@/component-library';

const queryString = require('query-string');

type UseTabPageLocationResult = {
  tabsProps: Pick<TabsProps, 'onSelectionChange' | 'defaultSelectedKey'>;
};

const useTabPageLocation = (): UseTabPageLocationResult => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParameters = queryString.parse(location.search);

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
    tabsProps: {
      defaultSelectedKey: currentQueryParameters.tab,
      onSelectionChange: handleSelectionChange
    }
  };
};

export { useTabPageLocation };
export type { UseTabPageLocationResult };
