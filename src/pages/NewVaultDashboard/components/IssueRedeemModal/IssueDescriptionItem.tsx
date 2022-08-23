import { HTMLAttributes, ReactNode } from 'react';

import { ReactComponent as InformationIcon } from '@/assets/img/hero-icons/information-circle.svg';
import { Span } from '@/component-library';

import { StyledDd, StyledDItem, StyledDt } from './IssueRedeemModal.styles';

type Props = {
  informative?: boolean;
  term: ReactNode;
  detail: ReactNode;
  subdetail: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props | 'children'>;

type IssueDescriptionItemProps = Props & NativeAttrs;

const IssueDescriptionItem = ({
  informative,
  term,
  detail,
  subdetail,
  ...props
}: IssueDescriptionItemProps): JSX.Element => (
  <StyledDItem {...props}>
    <StyledDt>
      {term}
      {informative && <InformationIcon width='1.5em' height='1.5em' />}
    </StyledDt>
    <StyledDd>
      <Span color='secondary'>{detail}</Span> {subdetail}
    </StyledDd>
  </StyledDItem>
);

export { IssueDescriptionItem };
export type { IssueDescriptionItemProps };
