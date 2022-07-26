import { useRef } from 'react';
import { useTab } from 'react-aria';

import { StyledTab } from './Tabs.style';

const Tab = ({ item, state }: any): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps } = useTab(item, state, ref);

  return (
    <StyledTab {...tabProps} ref={ref}>
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
