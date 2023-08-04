import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { MainContainer } from '@/components';
import { TXType } from '@/types/general.d';
import { URL_PARAMETERS } from '@/utils/constants/links';

const IssueTX = React.lazy(() => import(/* webpackChunkName: 'issue-tx' */ './IssueTX'));
const RedeemTX = React.lazy(() => import(/* webpackChunkName: 'redeem-tx' */ './RedeemTX'));
const ReplaceTX = React.lazy(() => import(/* webpackChunkName: 'replace-tx' */ './ReplaceTX'));

const TX = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <MainContainer>
      <Switch>
        <Route path={`${path}/${TXType.Issue}/:${URL_PARAMETERS.TRANSACTION.HASH}`}>
          <IssueTX />
        </Route>
        <Route path={`${path}/${TXType.Redeem}/:${URL_PARAMETERS.TRANSACTION.HASH}`}>
          <RedeemTX />
        </Route>
        <Route path={`${path}/${TXType.Replace}/:${URL_PARAMETERS.TRANSACTION.HASH}`}>
          <ReplaceTX />
        </Route>
      </Switch>
    </MainContainer>
  );
};

export default TX;
