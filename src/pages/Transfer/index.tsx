
import * as React from 'react';
import clsx from 'clsx';

import TransferForm from './TransferForm';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';
import useUpdateQueryParameters, { QueryParameters } from 'utils/hooks/use-update-query-parameters';

const Transfer = (): JSX.Element | null => {
  const updateQueryParameters = useUpdateQueryParameters();

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    updateQueryParametersRef.current = updateQueryParameters;
  });
  return (
    <MainContainer>
      <Panel
        className={clsx(
          'mx-auto',
          'w-full',
          'md:max-w-xl',
          'p-10'
        )}>
        <TransferForm />
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
