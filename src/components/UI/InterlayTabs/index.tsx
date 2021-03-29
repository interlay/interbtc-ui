
import {
  Tabs,
  TabsProps,
  Tab,
  TabProps
} from 'react-bootstrap';

// TODO: should use a tailwindcss Tabs component
const InterlayTabs = (props: TabsProps) => (
  <Tabs {...props} />
);

const InterlayTab = (props: TabProps) => (
  <Tab {...props} />
);

export {
  InterlayTab
};

export default InterlayTabs;
