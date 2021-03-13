
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
        { 'bg-interlayPink': tabType === TabTypes.Issue && selectedTabType === TabTypes.Issue },
        { 'bg-interlayYellow': tabType === TabTypes.Redeem && selectedTabType === TabTypes.Redeem },
        { 'bg-interlayBlue': tabType === TabTypes.Transfer && selectedTabType === TabTypes.Transfer },
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
      { 'border-interlayPink': selectedTabType === TabTypes.Issue },
      { 'border-interlayYellow': selectedTabType === TabTypes.Redeem },
      { 'border-interlayBlue': selectedTabType === TabTypes.Transfer }
    )} />
);

// TODO: could be simpler using a library
const Tabs = ({ children }: Props) => (
  <div
    className={clsx(
      'flex',
      'rounded-lg',
      'bg-interlayGrey-light'
    )}>
    {children}
  </div>
);

export {
  Tab,
  HorizontalLine
};

export default Tabs;
