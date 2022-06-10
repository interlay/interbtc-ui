import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';

const IssueTransaction = React.lazy(() => import(/* webpackChunkName: 'issue-transaction' */ './IssueTransaction'));
const RedeemTransaction = React.lazy(() => import(/* webpackChunkName: 'redeem-transaction' */ './RedeemTransaction'));
const ReplaceTransaction = React.lazy(
  () => import(/* webpackChunkName: 'replace-transaction' */ './ReplaceTransaction')
);

enum TransactionType {
  Issue = 'issue',
  Redeem = 'redeem',
  Replace = 'replace'
}

const Transaction = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <MainContainer>
      <Switch>
        <Route path={`${path}/${TransactionType.Issue}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <IssueTransaction />
        </Route>
        <Route path={`${path}/${TransactionType.Redeem}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <RedeemTransaction />
        </Route>
        <Route path={`${path}/${TransactionType.Replace}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <ReplaceTransaction />
        </Route>
      </Switch>
    </MainContainer>
  );
};

export default Transaction;
