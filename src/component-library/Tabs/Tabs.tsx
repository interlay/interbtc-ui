import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useTabList } from 'react-aria';
import { useTabListState } from 'react-stately';

import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { TabList, TabListWrapper, TabSelection } from './Tabs.style';

type Props = {
  defaultIndex?: number;
  index?: number;
  onChange?: (index: number) => void;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = (props: any): JSX.Element => {
  const state = useTabListState(props);
  const ref = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList(props, state, ref);

  const [activeTabStyle, setActiveTabStyle] = useState({
    width: 0,
    transform: 'translateX(0)'
  });

  useEffect(() => {
    const activeTab = ref.current?.querySelector<HTMLDivElement>('[role="tab"][aria-selected="true"]');

    if (!activeTab) return;

    setActiveTabStyle({
      width: activeTab.offsetWidth,
      transform: `translateX(${activeTab?.offsetLeft}px)`
    });
  }, [state.selectedKey]);

  return (
    <div>
      <TabListWrapper>
        <TabSelection style={{ zIndex: -1, ...activeTabStyle }} />
        <TabList {...tabListProps} ref={ref}>
          {[...state.collection].map((item) => (
            <Tab key={item.key} item={item} state={state} />
          ))}
        </TabList>
      </TabListWrapper>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};

export { Tabs };
export type { TabsProps };
