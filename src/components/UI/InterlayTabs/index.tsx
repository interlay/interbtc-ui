
// ray test touch <
import {
  Tabs,
  TabsProps,
  Tab,
  TabProps
} from 'react-bootstrap';

// TODO: should use a tailwindcss Tabs component
const InterlayTabs = (props: TabsProps): JSX.Element => (
  <Tabs {...props} />
);

const InterlayTab = (props: TabProps): JSX.Element => (
  <Tab {...props} />
);

export {
  InterlayTab
};

export default InterlayTabs;
// ray test touch >
