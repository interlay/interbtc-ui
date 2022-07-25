import { HTMLAttributes } from 'react';

import { Card } from './InsightsList.style';

type NativeAttrs = HTMLAttributes<unknown>;

type InsightsListProps = NativeAttrs;

const InsightsList = ({ children, ...props }: InsightsListProps): JSX.Element => <Card {...props}>{children}</Card>;

export { InsightsList };
export type { InsightsListProps };
