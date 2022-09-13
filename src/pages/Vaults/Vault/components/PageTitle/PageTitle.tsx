import { HTMLAttributes } from 'react';

import { P } from '@/component-library';
import TimerIncrement from '@/parts/TimerIncrement';

import { StyledTitle, StyledWrapper } from './PageTitle.styles';

type NativeAttrs = HTMLAttributes<unknown>;

type PageTitleProps = NativeAttrs;

const PageTitle = (props: PageTitleProps): JSX.Element => (
  <StyledWrapper {...props}>
    <StyledTitle>Vault Dashboard</StyledTitle>
    <P color='tertiary'>
      <TimerIncrement />
    </P>
  </StyledWrapper>
);

export { PageTitle };
export type { PageTitleProps };
