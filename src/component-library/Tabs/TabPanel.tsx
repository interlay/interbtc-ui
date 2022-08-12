import { useTabPanel } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabPanelProps } from '@react-types/tabs';
import { HTMLAttributes, useRef } from 'react';

type NativeAttrs = HTMLAttributes<unknown>;

type InheritAttrs = AriaTabPanelProps & { state: TabListState<Record<string, any>> };

type TabPanelProps = InheritAttrs & NativeAttrs;

// @internal
const TabPanel = ({ state, children, ...props }: TabPanelProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} ref={ref}>
      {children || state.selectedItem?.props.children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export { TabPanel };
export type { TabPanelProps };
