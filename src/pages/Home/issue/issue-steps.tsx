
// ray test touch <<
import { useSelector } from 'react-redux';

import EnterBTCAmount from './EnterBTCAmount';
import BTCPayment from './BTCPayment';
import { StoreType } from 'common/types/util.types';

const IssueSteps = (): JSX.Element => {
  const step = useSelector((state: StoreType) => state.issue.step);

  return (
    <>
      {step === 'ENTER_BTC_AMOUNT' && <EnterBTCAmount />}
      {step === 'BTC_PAYMENT' && <BTCPayment />}
    </>
  );
};

export default IssueSteps;
// ray test touch >>
