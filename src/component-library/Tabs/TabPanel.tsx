import { useRef } from 'react';
import { useTabPanel } from 'react-aria';

const TabPanel = ({ state, ...props }: any): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
};

export { TabPanel };
