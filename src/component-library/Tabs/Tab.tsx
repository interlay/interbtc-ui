import { useTab } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { ReactNode, useRef } from 'react';

import { StyledTab } from './Tabs.style';

type TabProps<T> = { item: AriaTabProps & { rendered: ReactNode }; state: TabListState<T> };

// eslint-disable-next-line @typescript-eslint/ban-types
const Tab = <T extends object>({ item, state }: TabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps } = useTab(item, state, ref);

  return (
    <StyledTab {...tabProps} ref={ref}>
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
