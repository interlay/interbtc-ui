import { useFocusRing } from '@react-aria/focus';
import { useTabList } from '@react-aria/tabs';
import { mergeProps } from '@react-aria/utils';
import { useTabListState } from '@react-stately/tabs';
import { CollectionChildren } from '@react-types/shared';
import { forwardRef, HTMLAttributes, Key, useEffect, useState } from 'react';

import { useDOMRef } from '../utils/dom';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { TabList, TabListWrapper, TabSelection } from './Tabs.style';

type Props = {
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (index: Key) => void;
  disabledKeys?: Key[];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, ...props }, ref): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const ariaProps = { children: children as CollectionChildren<object>, ...props };
    const state = useTabListState(ariaProps);
    const tabsListRef = useDOMRef<HTMLDivElement>(ref);
    const { tabListProps } = useTabList(ariaProps, state, tabsListRef);

    const [activeTabStyle, setActiveTabStyle] = useState({
      width: 0,
      transform: 'translateX(0)'
    });

    useEffect(() => {
      const activeTab = tabsListRef.current?.querySelector<HTMLDivElement>('[role="tab"][aria-selected="true"]');

      if (!activeTab) return;

      setActiveTabStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab?.offsetLeft}px)`
      });
    }, [state.selectedKey, tabsListRef]);

    const { focusProps, isFocusVisible } = useFocusRing({
      within: true
    });

    return (
      <div>
        <TabListWrapper>
          <TabSelection isFocusVisible={isFocusVisible} style={activeTabStyle} />
          <TabList {...mergeProps(tabListProps, focusProps)} ref={tabsListRef}>
            {[...state.collection].map((item) => (
              <Tab key={item.key} item={item} state={state} />
            ))}
          </TabList>
        </TabListWrapper>
        <TabPanel key={state.selectedItem?.key} state={state} />
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps };
