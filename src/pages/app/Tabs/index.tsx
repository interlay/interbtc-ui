
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { setActiveTabAction } from 'common/actions/general.actions';
import { TabTypes } from 'utils/enums/tab-types';
import styles from './tabs.module.css';

interface Props {
  children: React.ReactNode
}

interface TabProps {
  tabType: TabTypes;
  selectedTabType: TabTypes;
  children: React.ReactNode;
}

const Tab = ({
  tabType,
  selectedTabType,
  children
}: TabProps) => {
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

interface HorizontalLineProps {
  selectedTabType: TabTypes;
}

const HorizontalLine = ({ selectedTabType }: HorizontalLineProps) => (
  <hr
    className={clsx(
      styles['horizontal-line'],
      { [styles['horizontal-line-pink']]: selectedTabType === TabTypes.Issue },
      { [styles['horizontal-line-yellow']]: selectedTabType === TabTypes.Redeem },
      { [styles['horizontal-line-blue']]: selectedTabType === TabTypes.Transfer }
    )} />
);

// TODO: could be simpler using a library
const Tabs = ({ children }: Props) => (
  <div className={clsx(styles['app-tabs'], 'row')}>
    {children}
  </div>
);

export {
  Tab,
  HorizontalLine
};

export default Tabs;
