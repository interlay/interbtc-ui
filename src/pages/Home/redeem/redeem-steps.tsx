
import { useSelector } from 'react-redux';

import EnterAmountAndAddress from './EnterAmountAndAddress';
import RedeemInfo from './RedeemInfo';
import { StoreType } from 'common/types/util.types';

const RedeemSteps = (): JSX.Element => {
  const step = useSelector((state: StoreType) => state.redeem.step);

  return (
    <>
      {step === 'AMOUNT_AND_ADDRESS' && <EnterAmountAndAddress />}
      {step === 'REDEEM_INFO' && <RedeemInfo />}
    </>
  );
};

export default RedeemSteps;
