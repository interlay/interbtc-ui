import { HTMLAttributes, ReactNode } from 'react';

import {
  InsightItemLabel,
  InsightItemSubLabel,
  InsightItemTitle,
  InsightsListItemWrapper,
  InsightsListWrapper,
  InsightsTitle
} from './InsightsList.style';

type InsightListItem = {
  title: ReactNode;
  label: ReactNode;
  sublabel?: ReactNode;
  adornment?: ReactNode;
};

type Props = {
  direction?: 'row' | 'column';
  items: InsightListItem[];
  title?: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InsightsListProps = Props & NativeAttrs;

// TODO: add capacity adornment
const InsightsList = ({ direction, items, title, ...props }: InsightsListProps): JSX.Element => {
  const isCol = direction === 'column';
  return (
    <InsightsListWrapper {...props} $isCol={isCol} variant='bordered'>
      {title && <InsightsTitle>{title}</InsightsTitle>}
      {items.map(({ title, label, sublabel, adornment }, key) => (
        <InsightsListItemWrapper $isCol={isCol} key={key}>
          <div>
            <InsightItemTitle color='tertiary'>{title}</InsightItemTitle>
            <InsightItemLabel color='secondary'>{label}</InsightItemLabel>
            {sublabel && <InsightItemSubLabel>{sublabel}</InsightItemSubLabel>}
          </div>
          {adornment}
        </InsightsListItemWrapper>
      ))}
    </InsightsListWrapper>
  );
};

export { InsightsList };
export type { InsightListItem, InsightsListProps };
