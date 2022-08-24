import { HTMLAttributes } from 'react';

// TODO: fix import
import { Status } from '@/component-library/utils/prop-types';

import { StyledTag } from './StatusTag.styles';

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
