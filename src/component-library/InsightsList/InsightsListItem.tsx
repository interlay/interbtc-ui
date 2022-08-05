import { HTMLAttributes, ReactNode } from 'react';

import { InsightLabel, InsightsListItemWrapper, InsightSubLabel, InsightTitle } from './InsightsList.style';

type Props = {
  title?: ReactNode;
  label?: ReactNode;
  sublabel?: ReactNode;
};

type NativeAttrs = HTMLAttributes<unknown>;

type InsightsListItemProps = Props & NativeAttrs;

const InsightsListItem = ({ title, label, sublabel, children, ...props }: InsightsListItemProps): JSX.Element => {
  if (!!title && !!label) {
    return (
      <InsightsListItemWrapper hasInfo {...props}>
        <InsightTitle>{title}</InsightTitle>
        <InsightLabel>{label}</InsightLabel>
        {sublabel && <InsightSubLabel>{sublabel}</InsightSubLabel>}
      </InsightsListItemWrapper>
    );
  }

  return <InsightsListItemWrapper {...props}>{children}</InsightsListItemWrapper>;
};

export { InsightsListItem };
export type { InsightsListItemProps };
