import { useFocusRing } from '@react-aria/focus';
import { useTabList } from '@react-aria/tabs';
import { mergeProps } from '@react-aria/utils';
import { useTabListState } from '@react-stately/tabs';
import { CollectionChildren } from '@react-types/shared';
import { forwardRef, HTMLAttributes, Key, useEffect, useState } from 'react';

import { useDOMRef } from '../utils/dom';
import { Sizes } from '../utils/prop-types';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { StyledTabs, TabList, TabListWrapper, TabSelection } from './Tabs.style';

type Props = {
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (index: Key) => void;
  disabledKeys?: Key[];
  panel?: React.ReactNode;
  fullWidth?: boolean;
  size?: Exclude<Sizes, 'small'>;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, className, style, panel, fullWidth = false, size = 'medium', ...props }, ref): JSX.Element => {
    const ariaProps = { children: children as CollectionChildren<Record<string, unknown>>, ...props };
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
      <StyledTabs className={className} style={style}>
        <TabListWrapper $size={size} $fullWith={fullWidth}>
          <TabSelection
            $isFocusVisible={isFocusVisible}
            $width={activeTabStyle.width}
            $transform={activeTabStyle.transform}
            $size={size}
          />
          <TabList {...mergeProps(tabListProps, focusProps)} ref={tabsListRef} $fullWith={fullWidth}>
            {[...state.collection].map((item) => (
              <Tab key={item.key} item={item} state={state} fullWidth={fullWidth} size={size} />
            ))}
          </TabList>
        </TabListWrapper>
        <TabPanel key={state.selectedItem?.key} state={state}>
          {panel}
        </TabPanel>
      </StyledTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps };
