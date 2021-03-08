import EnterAmountAndAddress from './enter-amount-and-address';
import RedeemInfo from './redeem-info';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';

export default function RedeemSteps() {
  const step = useSelector((state: StoreType) => state.redeem.step);

  return (
    <div className='redeem-steps'>
      {step === 'AMOUNT_AND_ADDRESS' && <EnterAmountAndAddress />}
      {step === 'REDEEM_INFO' && <RedeemInfo />}
    </div>
  );
}
