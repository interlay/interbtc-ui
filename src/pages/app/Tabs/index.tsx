
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { setActiveTabAction } from 'common/actions/general.actions';
import { TabTypes } from 'utils/enums/tab-types';

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
}: TabProps): JSX.Element => {
  const dispatch = useDispatch();

  // TODO: should use query parameter instead of redux
  const handleTabChange = (tab: TabTypes) => () => {
    dispatch(setActiveTabAction(tab));
  };

  return (
    <div
      // TODO: hardcoded
      style={{
        fontWeight: 700
      }}
      className={clsx(
        'flex-1',
        'p-2.5',
        'uppercase',
        'cursor-pointer',
        { 'rounded-lg text-white transition-all duration-200 ease-in-out': selectedTabType === tabType },
        { 'bg-interlayPink': tabType === TabTypes.Issue && selectedTabType === TabTypes.Issue },
        { 'bg-interlayYellow': tabType === TabTypes.Redeem && selectedTabType === TabTypes.Redeem },
        { 'bg-interlayBlue': tabType === TabTypes.Transfer && selectedTabType === TabTypes.Transfer },
        { 'opacity-30': selectedTabType !== tabType }
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

const HorizontalLine = ({ selectedTabType }: HorizontalLineProps): JSX.Element => (
  <hr
    className={clsx(
      'border-t-2',
      'my-2',
      { 'border-interlayPink': selectedTabType === TabTypes.Issue },
      { 'border-interlayYellow': selectedTabType === TabTypes.Redeem },
      { 'border-interlayBlue': selectedTabType === TabTypes.Transfer }
    )} />
);

// TODO: could be simpler using a library
const Tabs = ({ children }: Props): JSX.Element => (
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
