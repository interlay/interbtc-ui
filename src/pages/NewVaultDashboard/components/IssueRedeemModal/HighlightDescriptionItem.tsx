import { HTMLAttributes, ReactNode } from 'react';

import { StyledHighlightDd, StyledHighlightDItem, StyledHighlightDt } from './IssueRedeemModal.styles';

type Props = {
  term: ReactNode;
  detail: ReactNode;
  clickable?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props | 'children'>;

type HighlightDescriptionItemProps = Props & NativeAttrs;

const HighlightDescriptionItem = ({
  term,
  detail,
  clickable = false,
  ...props
}: HighlightDescriptionItemProps): JSX.Element => (
  <StyledHighlightDItem $clickable={clickable} {...props}>
    <StyledHighlightDt>{term}</StyledHighlightDt>
    <StyledHighlightDd>{detail}</StyledHighlightDd>
  </StyledHighlightDItem>
);

export { HighlightDescriptionItem };
export type { HighlightDescriptionItemProps };
