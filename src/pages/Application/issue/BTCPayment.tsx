
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayButton from 'components/UI/InterlayButton';
import { StoreType } from 'common/types/util.types';
import {
  resetIssueWizardAction,
  changeIssueStepAction
} from 'common/actions/issue.actions';
import PaymentView from './modal/PaymentView';

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
    dispatch(changeIssueStepAction('ENTER_BTC_AMOUNT'));
    dispatch(resetIssueWizardAction());
  };

  return (
    <>
      {request && <PaymentView request={request} />}
      <InterlayButton
        className={clsx(
          'mx-auto',
          'mt-8'
        )}
        variant='contained'
        color='default'
        onClick={handleClick}>
        {t('issue_page.made_payment')}
      </InterlayButton>
    </>
  );
};

export default BTCPayment;
