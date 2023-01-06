import { HTMLAttributes } from 'react';

import { Status } from '@/component-library';

import { StyledTag } from './PoolsBaseTable.style';

type Props = {
  status: Status;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type StatusTagProps = Props & NativeAttrs;

const StatusTag = ({ status, children, ...props }: StatusTagProps): JSX.Element => (
  <StyledTag $variant={status} {...props}>
    {children}
  </StyledTag>
);

export { StatusTag };
export type { StatusTagProps };
