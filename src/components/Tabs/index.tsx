
import * as React from 'react';
import clsx from 'clsx';

const TAB_ITEMS = [
  {
    id: 'tab1',
    label: 'Tab1'
  },
  {
    id: 'tab2',
    label: 'Tab2'
  },
  {
    id: 'tab3',
    label: 'Tab3'
  }
];

interface TabProps {
  selected: boolean;
  id: string;
  children: React.ReactNode;
  onSelect: () => void;
  listClassName?: string;
  anchorClassName?: string;
}

const Tab = ({
  selected,
  id,
  children,
  onSelect,
  listClassName,
  anchorClassName
}: TabProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect();
  };

  return (
    <li
      className={clsx(
        'text-center',
        listClassName
      )}>
      <a
        className={clsx(
          'text-xs',
          'font-medium',
          'px-4',
          'py-2',
          'block',
          selected ?
            'text-white bg-pink-600' :
            'text-pink-600 bg-white',
          anchorClassName
        )}
        href={`#${id}`}
        role='tablist'
        data-toggle='tab'
        onClick={handleClick}>
        {children}
      </a>
    </li>
  );
};

interface TabPanelProps {
  id: string;
  index: number;
  selectedIndex: number;
}

const TabPanel = ({
  id,
  index,
  selectedIndex,
  className,
  ...rest
}: TabPanelProps & React.ComponentPropsWithRef<'div'>) => (
  <div
    id={id}
    className={clsx(
      selectedIndex === index ? 'block' : 'hidden',
      className
    )}
    {...rest} />
);

const Tabs = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <>
      <ul
        className={clsx(
          'flex',
          className
        )}
        role='tablist'
        {...rest}>
        {TAB_ITEMS.map((tabItem, index) => (
          <Tab
            key={tabItem.id}
            id={tabItem.id}
            selected={index === selectedIndex}
            onSelect={() => setSelectedIndex(index)}>
            {tabItem.label}
          </Tab>
        ))}
      </ul>
      <TabPanel
        index={0}
        selectedIndex={selectedIndex}
        id='tab1'>
        Tab1
      </TabPanel>
      <TabPanel
        index={1}
        selectedIndex={selectedIndex}
        id='tab2'>
        Tab2
      </TabPanel>
      <TabPanel
        index={2}
        selectedIndex={selectedIndex}
        id='tab3'>
        Tab3
      </TabPanel>
    </>
  );
};

export default Tabs;
