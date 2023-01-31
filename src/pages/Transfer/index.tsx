import clsx from 'clsx';
import * as React from 'react';

import { Tabs, TabsItem } from '@/component-library';
import Panel from '@/components/Panel';
import MainContainer from '@/parts/MainContainer';
import useUpdateQueryParameters, { QueryParameters } from '@/utils/hooks/use-update-query-parameters';

import CrossChainTransferForm from './CrossChainTransferForm';
import TransferForm from './TransferForm';

const Transfer = (): JSX.Element | null => {
  const updateQueryParameters = useUpdateQueryParameters();

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();

  React.useLayoutEffect(() => {
    updateQueryParametersRef.current = updateQueryParameters;
  });

  return (
    <MainContainer>
      <Panel className={clsx('mx-auto', 'w-full', 'md:max-w-xl', 'p-10')}>
        <Tabs size='large' fullWidth>
          <TabsItem title='Transfer'>
            <TransferForm />
          </TabsItem>
          <TabsItem title='Cross chain transfer'>
            <CrossChainTransferForm />
          </TabsItem>
        </Tabs>
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
