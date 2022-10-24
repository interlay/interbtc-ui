import { useTab } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { ReactNode, useRef } from 'react';

import { Sizes } from '../utils/prop-types';
import { StyledTab } from './Tabs.style';

type TabProps<T> = {
  item: AriaTabProps & { rendered: ReactNode };
  state: TabListState<T>;
  fullWidth?: boolean;
  size: Exclude<Sizes, 'small'>;
};

// @internal
const Tab = <T extends Record<string, unknown>>({
  item,
  state,
  fullWidth = false,
  size = 'medium'
}: TabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps } = useTab(item, state, ref);

  return (
    <StyledTab {...tabProps} ref={ref} $fullWidth={fullWidth} $size={size}>
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
export type { TabProps };
