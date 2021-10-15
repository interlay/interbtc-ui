
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';
import clsx from 'clsx';

import Tabs, {
  Tab,
  TabPanel,
  TabsProps
} from './';

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

const Template: Story<TabsProps> = args => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSelect = (newIndex: number) => () => {
    setSelectedIndex(newIndex);
  };

  return (
    <>
      <Tabs {...args}>
        {TAB_ITEMS.map((tabItem, index) => {
          const selected = index === selectedIndex;

          return (
            <Tab
              anchorClassName={clsx(
                'font-medium',
                'text-xs',
                'px-4',
                'py-2.5',
                'uppercase',
                // ray test touch <<
                selected ?
                  'text-white bg-pink-600' :
                  'text-pink-600 bg-white'
                // ray test touch >>
              )}
              key={tabItem.id}
              id={tabItem.id}
              onSelect={handleSelect(index)}>
              {tabItem.label}
            </Tab>
          );
        })}
      </Tabs>
      <TabPanel
        index={0}
        selectedIndex={selectedIndex}
        id='link1'>
        <p>
          TabPanel1
        </p>
      </TabPanel>
      <TabPanel
        index={1}
        selectedIndex={selectedIndex}
        id='link2'>
        <p>
          TabPanel2
        </p>
      </TabPanel>
      <TabPanel
        index={2}
        selectedIndex={selectedIndex}
        id='link3'>
        <p>
          TabPanel3
        </p>
      </TabPanel>
    </>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Tabs',
  component: Tabs
} as Meta;
