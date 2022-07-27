import { useTab } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { ReactNode, useRef } from 'react';

import { StyledTab } from './Tabs.style';

type TabProps<T> = { item: AriaTabProps & { rendered: ReactNode }; state: TabListState<T> };

// @internal
const Tab = <T extends Record<string, unknown>>({ item, state }: TabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps } = useTab(item, state, ref);

  return (
    <StyledTab {...tabProps} ref={ref}>
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
export type { TabProps };
