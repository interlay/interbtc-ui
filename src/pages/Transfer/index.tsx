
import * as React from 'react';
import clsx from 'clsx';

import TransferForm from './TransferForm';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';
import InterlayTabGroup from 'components/UI/InterlayTabGroup';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters, { QueryParameters } from 'utils/hooks/use-update-query-parameters';
import TAB_IDS from 'utils/constants/tab-ids';
import { QUERY_PARAMETERS } from 'utils/constants/links';

const TAB_ITEMS = [
  {
    id: TAB_IDS.transfer,
    label: 'transfer'
  }
];

const Transfer = (): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedTabId = queryParams.get(QUERY_PARAMETERS.TAB);
  const updateQueryParameters = useUpdateQueryParameters();

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    updateQueryParametersRef.current = updateQueryParameters;
  });

  React.useEffect(() => {
    if (!updateQueryParametersRef.current) return;

    const tabIdValues = Object.values(TAB_IDS);
    switch (true) {
    case selectedTabId === null:
    case selectedTabId && !tabIdValues.includes(selectedTabId):
      updateQueryParametersRef.current({
        [QUERY_PARAMETERS.TAB]: TAB_IDS.issue
      });
    }
  }, [
    selectedTabId
  ]);

  if (selectedTabId === null) {
    return null;
  }

  const selectedTabIndex = TAB_ITEMS.findIndex(tabItem => tabItem.id === selectedTabId);

  const handleTabSelect = (index: number) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.TAB]: TAB_ITEMS[index].id
    });
  };

  return (
    <MainContainer>
      <Panel
        className={clsx(
          'mx-auto',
          'w-full',
          'md:max-w-xl',
          'p-10'
        )}>
        <InterlayTabGroup
          defaultIndex={selectedTabIndex}
          onChange={index => {
            handleTabSelect(index);
          }}>
          <TransferForm />
        </InterlayTabGroup>
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
