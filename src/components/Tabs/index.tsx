
import * as React from 'react';
import clsx from 'clsx';

interface TabProps {
  id: string;
  children: React.ReactNode;
  onSelect: () => void;
  listClassName?: string;
  anchorClassName?: string;
}

const Tab = ({
  id,
  children,
  onSelect,
  listClassName,
  anchorClassName
}: TabProps): JSX.Element => {
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
          'block',
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
  ...rest
}: TabPanelProps & React.ComponentPropsWithRef<'div'>): JSX.Element | null => {
  const selected = selectedIndex === index;
  if (!selected) return null;

  return (
    <div
      id={id}
      {...rest} />
  );
};

const Tabs = (props: TabsProps): JSX.Element => {
  return (
    <ul
      role='tablist'
      {...props} />
  );
};

export type TabsProps = React.ComponentPropsWithRef<'ul'>;

export {
  Tab,
  TabPanel
};

export default Tabs;
