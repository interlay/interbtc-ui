import { useTabPanel } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabPanelProps } from '@react-types/tabs';
import { useRef } from 'react';

type TabPanelProps<T> = AriaTabPanelProps & { state: TabListState<T> };

// @internal
// eslint-disable-next-line @typescript-eslint/ban-types
const TabPanel = <T extends object>({ state, ...props }: TabPanelProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
};

export { TabPanel };
