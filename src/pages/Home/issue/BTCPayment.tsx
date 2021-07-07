
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import { StoreType } from 'common/types/util.types';
import {
  resetIssueWizardAction,
  changeIssueStepAction
} from 'common/actions/issue.actions';
import BTCPaymentPendingStatusUI from './BTCPaymentPendingStatusUI';

const BTCPayment = (): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);
  const { id } = useSelector((state: StoreType) => state.issue);
  const requests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
  // ray test touch <
  const request = requests.filter(req => req.id === id)[0];
  // ray test touch >
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClick = () => {
    // ray test touch <<
    dispatch(changeIssueStepAction('ENTER_BTC_AMOUNT'));
    dispatch(resetIssueWizardAction());
    // ray test touch >>
  };

  return (
    <>
      {request && <BTCPaymentPendingStatusUI request={request} />}
      <InterlayDefaultContainedButton
        style={{ display: 'flex' }}
        className={clsx(
          'mx-auto',
          'mt-8'
        )}
        onClick={handleClick}>
        {t('issue_page.made_payment')}
      </InterlayDefaultContainedButton>
    </>
  );
};

export default BTCPayment;
