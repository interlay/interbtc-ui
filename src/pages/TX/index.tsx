import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import MainContainer from 'parts/MainContainer';
import { URL_PARAMETERS } from 'utils/constants/links';

const IssueTX = React.lazy(() => import(/* webpackChunkName: 'issue-tx' */ './IssueTX'));
const RedeemTX = React.lazy(() => import(/* webpackChunkName: 'redeem-tx' */ './RedeemTX'));
const ReplaceTX = React.lazy(() => import(/* webpackChunkName: 'replace-tx' */ './ReplaceTX'));

enum TXType {
  Issue = 'issue',
  Redeem = 'redeem',
  Replace = 'replace'
}

const TX = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <MainContainer>
      <Switch>
        <Route path={`${path}/${TXType.Issue}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <IssueTX />
        </Route>
        <Route path={`${path}/${TXType.Redeem}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <RedeemTX />
        </Route>
        <Route path={`${path}/${TXType.Replace}/:${URL_PARAMETERS.TRANSACTION_HASH}`}>
          <ReplaceTX />
        </Route>
      </Switch>
    </MainContainer>
  );
};

export default TX;
