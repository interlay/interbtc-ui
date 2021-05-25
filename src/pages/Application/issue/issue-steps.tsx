import EnterBTCAmount from './EnterBTCAmount';
import BTCPayment from './BTCPayment';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';

export default function IssueSteps(): JSX.Element {
  const step = useSelector((state: StoreType) => state.issue.step);

  return (
    <div className='issue-steps'>
      {step === 'ENTER_BTC_AMOUNT' && <EnterBTCAmount />}
      {step === 'BTC_PAYMENT' && <BTCPayment />}
    </div>
  );
}
