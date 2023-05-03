import { useTab } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { ReactNode, useRef } from 'react';

import { Sizes } from '../utils/prop-types';
import { StyledTab } from './Tabs.style';

type Props = {
  fullWidth?: boolean;
  size: Sizes;
};

type InheritProps<T> = {
  item: AriaTabProps & { rendered: ReactNode };
  state: TabListState<T>;
};

type TabProps<T> = Props & InheritProps<T>;

// @internal
const Tab = <T extends Record<string, unknown>>({
  item,
  state,
  fullWidth = false,
  size = 'small'
}: TabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps, isDisabled } = useTab(item, state, ref);

  return (
    <StyledTab {...tabProps} ref={ref} $isDisabled={isDisabled} $fullWidth={fullWidth} $size={size}>
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
export type { TabProps };
