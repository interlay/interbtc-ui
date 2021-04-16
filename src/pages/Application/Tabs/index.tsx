
import clsx from 'clsx';

import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import TAB_TYPES from 'utils/constants/tab-types';
import { QUERY_PARAMETERS } from 'utils/constants/links';

interface Props {
  children: React.ReactNode
}

interface TabProps {
  tabType: string;
  selectedTabType: string;
  children: React.ReactNode;
}

const Tab = ({
  tabType,
  selectedTabType,
  children
}: TabProps): JSX.Element => {
  const updateQueryParameters = useUpdateQueryParameters();

  const handleChange = (tabType: string) => () => {
    updateQueryParameters({
      [QUERY_PARAMETERS.type]: tabType
    });
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className={clsx(
        'font-bold',
        'flex-1',
        'p-2.5',
        'uppercase',
        'cursor-pointer',
        { 'rounded-lg text-white transition-all duration-200 ease-in-out': selectedTabType === tabType },
        { 'bg-interlayPink': tabType === TAB_TYPES.issue && selectedTabType === TAB_TYPES.issue },
        { 'bg-interlayYellow': tabType === TAB_TYPES.redeem && selectedTabType === TAB_TYPES.redeem },
        { 'bg-interlayBlue': tabType === TAB_TYPES.transfer && selectedTabType === TAB_TYPES.transfer },
        { 'opacity-30': selectedTabType !== tabType }
      )}
      onClick={handleChange(tabType)}>
      {children}
    </a>
  );
};

interface HorizontalLineProps {
  selectedTabType: string;
}

const HorizontalLine = ({ selectedTabType }: HorizontalLineProps): JSX.Element => (
  <hr
    className={clsx(
      'border-t-2',
      'my-2',
      { 'border-interlayPink': selectedTabType === TAB_TYPES.issue },
      { 'border-interlayYellow': selectedTabType === TAB_TYPES.redeem },
      { 'border-interlayBlue': selectedTabType === TAB_TYPES.transfer }
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
