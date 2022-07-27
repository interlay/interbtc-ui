import { useFocusRing } from '@react-aria/focus';
import { useTabList } from '@react-aria/tabs';
import { mergeProps } from '@react-aria/utils';
import { useTabListState } from '@react-stately/tabs';
import { CollectionChildren } from '@react-types/shared';
import { HTMLAttributes, Key, useEffect, useRef, useState } from 'react';

import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { TabList, TabListWrapper, TabSelection } from './Tabs.style';

type Props = {
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (index: Key) => void;
  disabledKeys?: Key[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  children: CollectionChildren<object>;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = (props: TabsProps): JSX.Element => {
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

  const { focusProps, isFocusVisible } = useFocusRing({
    within: true
  });

  return (
    <div>
      <TabListWrapper>
        <TabSelection isFocusVisible={isFocusVisible} style={activeTabStyle} />
        <TabList {...mergeProps(tabListProps, focusProps)} ref={ref}>
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
