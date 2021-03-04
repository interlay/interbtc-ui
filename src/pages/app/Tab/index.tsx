
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { setActiveTabAction } from 'common/actions/general.actions';
import { TabTypes } from 'utils/enums/tab-types';
import styles from './tab.module.css';

interface Props {
  tabType: TabTypes;
  selectedTabType: TabTypes;
  children: React.ReactNode;
}

const Tab = ({
  tabType,
  selectedTabType,
  children
}: Props) => {
  const dispatch = useDispatch();

  // TODO: should use query parameter instead of redux
  const handleTabChange = (tab: TabTypes) => () => {
    dispatch(setActiveTabAction(tab));
  };

  return (
    <div
      className={clsx(
        'col-4',
        styles['app-tab'],
        { [styles['active-tab']]: selectedTabType === tabType },
        { [styles['active-tab-issue']]: tabType === TabTypes.Issue && selectedTabType === TabTypes.Issue },
        { [styles['active-tab-redeem']]: tabType === TabTypes.Redeem && selectedTabType === TabTypes.Redeem },
        { [styles['active-tab-transfer']]: tabType === TabTypes.Transfer && selectedTabType === TabTypes.Transfer },
        { [styles['not-active-tab']]: selectedTabType !== tabType }
      )}
      // TODO: should use button semantically
      onClick={handleTabChange(tabType)}>
      {children}
    </div>
  );
};

export default Tab;
