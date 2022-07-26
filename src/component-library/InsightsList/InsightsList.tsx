import { HTMLAttributes } from 'react';

import { InsightsListWrapper } from './InsightsList.style';

type NativeAttrs = HTMLAttributes<unknown>;

type InsightsListProps = NativeAttrs;

const InsightsList = ({ children, ...props }: InsightsListProps): JSX.Element => (
  <InsightsListWrapper {...props} variant='bordered'>
    {children}
  </InsightsListWrapper>
);

export { InsightsList };
export type { InsightsListProps };
