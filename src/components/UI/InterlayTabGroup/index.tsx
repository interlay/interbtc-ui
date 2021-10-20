
import { Tab } from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';

const InterlayTabGroup = Tab.Group;
const InterlayTabPanels = Tab.Panels;

type InterlayTabListProps = Props<typeof Tab.List>;
const InterlayTabList = ({
  className,
  ...rest
}: InterlayTabListProps): JSX.Element => (
  <Tab.List
    className={clsx(
      'flex',
      'p-1',
      'space-x-1',
      'bg-blue-900/20',
      'rounded-xl',
      className
    )}
    {...rest} />
);

type InterlayTabProps = Props<typeof Tab>;
const InterlayTab = ({
  className,
  ...rest
}: InterlayTabProps): JSX.Element => (
  <Tab
    className={({ selected }) =>
      clsx(
        'w-full',
        'py-2.5',
        'text-sm',
        'leading-5',
        'font-medium',
        'text-blue-700',
        'rounded-lg',

        'focus:outline-none',
        'focus:ring-2',
        'ring-offset-2',
        'ring-offset-blue-400',
        'ring-white',
        'ring-opacity-60',
        selected ?
          clsx(
            'bg-white',
            'shadow'
          ) :
          clsx(
            'text-blue-100',
            'hover:bg-white/[0.12]',
            'hover:text-white'
          ),
        className
      )
    }
    {...rest} />
);

type InterlayTabPanelProps = Props<typeof Tab.Panel>;
const InterlayTabPanel = ({
  className,
  ...rest
}: InterlayTabPanelProps): JSX.Element => (
  <Tab.Panel
    className={clsx(
      'bg-white',
      'rounded-xl',
      'p-3',

      'focus:outline-none',
      'focus:ring-2',
      'ring-offset-2',
      'ring-offset-blue-400',
      'ring-white',
      'ring-opacity-60',
      className
    )}
    {...rest} />
);

export {
  InterlayTabList,
  InterlayTabPanels,
  InterlayTab,
  InterlayTabPanel
};

export default InterlayTabGroup;
